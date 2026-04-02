import jsonpack from 'jsonpack';
import compressedData from './data.compressed';
import { sanitize, maskTaxId } from './utils';

export interface TaxIdValidationResult {
    isValid: boolean;
    regexValid: boolean;
    checkSumCheckPresent: boolean;
    checkSum: boolean;
    onlineCheckPresent: boolean;
    onlineCheck: boolean;
    matchedType?: string;
    matchedLabel?: string;
}

export interface BulkValidationItem {
    countryCode: string;
    taxId: string;
}

export interface BulkValidationResult extends BulkValidationItem {
    result: TaxIdValidationResult | string;
}

export interface TaxIdTypeInfo {
    label: string;
    type: string;
    hasChecksum: boolean;
    hasOnlineCheck: boolean;
}

interface CountryEntry {
    label: string;
    type: string;
    regex: string;
    checksum: boolean;
    online: boolean;
}

interface CountryData {
    Country: string;
    ISOCountryCode: string;
    data: CountryEntry[];
}

interface ValidatorModule {
    [key: string]: (input: string, debug?: boolean) => boolean | Promise<boolean>;
}

const data: CountryData[] = jsonpack.unpack(compressedData);

// Territory aliasing: map overseas territories to parent country validation rules
const territoryAliases: Record<string, string> = {
    // French overseas territories → France
    GF: 'FR', // French Guiana
    GP: 'FR', // Guadeloupe
    MQ: 'FR', // Martinique
    RE: 'FR', // Réunion
    YT: 'FR', // Mayotte
    PM: 'FR', // Saint Pierre and Miquelon
    WF: 'FR', // Wallis and Futuna
    BL: 'FR', // Saint Barthélemy
    NC: 'FR', // New Caledonia
    PF: 'FR', // French Polynesia
    // British territories → United Kingdom
    JE: 'GB', // Jersey (if not already present)
    // Åland Islands → Finland
    AX: 'FI',
    // Dutch territories → Netherlands
    BQ: 'NL', // Bonaire, Sint Eustatius, Saba
};

// Build a Map for O(1) country lookup instead of linear .find()
const countryMap = new Map<string, CountryData>();
for (const item of data) {
    countryMap.set(item.ISOCountryCode, item);
}

// Cache compiled RegExp objects and validator modules
const regexCache = new Map<string, RegExp>();
const moduleCache = new Map<string, ValidatorModule | null>();

function getCompiledRegex(pattern: string | undefined): RegExp | null {
    if (!pattern) return null;
    let cached = regexCache.get(pattern);
    if (!cached) {
        cached = new RegExp(pattern);
        regexCache.set(pattern, cached);
    }
    return cached;
}

function getValidatorModule(countryCode: string): ValidatorModule | null {
    const key = countryCode.toUpperCase();
    const cached = moduleCache.get(key);
    if (cached !== undefined) return cached;
    let mod: ValidatorModule | null;
    try {
        mod = require(`./validators/${key}`);
    } catch {
        mod = null;
    }
    moduleCache.set(key, mod);
    return mod;
}

async function validateTaxId(
    countryCode: string,
    taxId: string,
    onlineCheckRequired: boolean = false,
    debug: boolean = false
): Promise<TaxIdValidationResult | string> {
    let code = countryCode.toUpperCase();

    // Resolve territory aliases
    if (territoryAliases[code]) {
        if (debug) {
            console.log(`Territory alias: ${code} → ${territoryAliases[code]}`);
        }
        code = territoryAliases[code];
    }

    const countryData = countryMap.get(code);

    if (!countryData) {
        if (debug) {
            console.log('No entries found for country');
        }
        return 'Country code not found';
    }

    let regexValid = false;
    let checkSumCheckPresent = false;
    let checkSumValid = false;
    let onlineCheckPresent = false;
    let onlineCheckResult = false;
    let matchedType: string | undefined;
    let matchedLabel: string | undefined;

    for (const entry of countryData.data) {
        const regex = getCompiledRegex(entry.regex);
        if (!regex || !regex.test(taxId)) continue;

        if (debug) {
            console.log('Entity Type', entry.type);
            console.log('Regex Match:', true);
            console.log('Checksum Validation Required:', entry.checksum);
        }

        regexValid = true;
        checkSumCheckPresent = entry.checksum;
        onlineCheckPresent = entry.online;
        matchedType = entry.type;
        matchedLabel = entry.label;

        if (checkSumCheckPresent || onlineCheckRequired) {
            const countryModule = getValidatorModule(code);
            if (debug && !countryModule) {
                console.error('Error loading validator module for', code);
            }

            // Strip country code prefix for checksum validators
            // Most validators expect the numeric/payload portion without the ISO prefix
            // Exception: CH (prefix is "CHE-", not just "CH") handles its own prefix
            const upperId = taxId.toUpperCase();
            const checksumInput = (code !== 'CH' && upperId.startsWith(code))
                ? taxId.substring(code.length)
                : taxId;

            if (checkSumCheckPresent && countryModule) {
                try {
                    const checksumFunctionName = `validate_${entry.type}`;
                    if (typeof countryModule[checksumFunctionName] === "function") {
                        checkSumValid = countryModule[checksumFunctionName](checksumInput) as boolean;
                        if (debug) {
                            console.log('Checksum Validation Result:', checkSumValid);
                        }
                    } else {
                        if (debug) {
                            console.error('Checksum function not found:', checksumFunctionName);
                        }
                    }
                } catch (err) {
                    if (debug) {
                        console.error('Error in checksum validation', err);
                    }
                }
            }

            if (onlineCheckRequired && countryModule) {
                try {
                    onlineCheckResult = await countryModule['online_check'](taxId, true) as boolean;
                    if (debug) {
                        console.log('Online Check Result:', onlineCheckResult);
                    }
                } catch (err) {
                    if (debug) {
                        console.error('Error in online check', err);
                    }
                }
            }
        }

        break;
    }

    let isValid = false;
    if (onlineCheckRequired) {
        isValid = regexValid && checkSumValid && onlineCheckResult;
    } else if (checkSumCheckPresent) {
        isValid = regexValid && checkSumValid;
    } else {
        isValid = regexValid;
    }

    return {
        isValid,
        regexValid,
        checkSumCheckPresent,
        checkSum: checkSumValid,
        onlineCheckPresent,
        onlineCheck: onlineCheckResult,
        matchedType,
        matchedLabel
    };
}

async function validateTaxIds(
    items: BulkValidationItem[],
    onlineCheckRequired: boolean = false,
    debug: boolean = false
): Promise<BulkValidationResult[]> {
    const results = await Promise.all(
        items.map(async (item) => ({
            countryCode: item.countryCode,
            taxId: item.taxId,
            result: await validateTaxId(item.countryCode, item.taxId, onlineCheckRequired, debug)
        }))
    );
    return results;
}

function getSupportedCountries(): string[] {
    return Array.from(countryMap.keys()).sort();
}

function isCountrySupported(countryCode: string): boolean {
    const code = countryCode.toUpperCase();
    return countryMap.has(code) || code in territoryAliases;
}

function getTaxIdInfo(countryCode: string): TaxIdTypeInfo[] | string {
    let code = countryCode.toUpperCase();
    if (territoryAliases[code]) {
        code = territoryAliases[code];
    }
    const countryData = countryMap.get(code);
    if (!countryData) {
        return 'Country code not found';
    }
    return countryData.data.map((entry) => ({
        label: entry.label,
        type: entry.type,
        hasChecksum: entry.checksum,
        hasOnlineCheck: entry.online
    }));
}

export { validateTaxId, validateTaxIds, getSupportedCountries, isCountrySupported, getTaxIdInfo, sanitize, maskTaxId };
export default validateTaxId;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = validateTaxId;
    module.exports.validateTaxId = validateTaxId;
    module.exports.validateTaxIds = validateTaxIds;
    module.exports.getSupportedCountries = getSupportedCountries;
    module.exports.isCountrySupported = isCountrySupported;
    module.exports.getTaxIdInfo = getTaxIdInfo;
    module.exports.sanitize = sanitize;
    module.exports.maskTaxId = maskTaxId;
}
