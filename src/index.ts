import rawData from './data.json';
import { sanitize, maskTaxId } from './utils';
import { checkOnline, getOnlineProvider } from './online';
import type { OnlineCheckOptions, OnlineCheckResult, OnlineDetails, OnlineStatus } from './online';

export type { OnlineCheckOptions, OnlineCheckResult, OnlineDetails, OnlineStatus };

/**
 * Options for {@link validateTaxId} / {@link validateTaxIds}.
 * Passing `true` instead of an object is shorthand for `{ online: true }`.
 */
export interface ValidateOptions extends OnlineCheckOptions {
    /** Verify against the official registry (VIES / ABN Lookup). Default false. */
    online?: boolean;
    /**
     * Require a positive registry answer: `unavailable` / `not_supported` then make
     * `isValid` false. Default false (only an explicit `invalid` fails the ID).
     */
    strict?: boolean;
    /** Log validation steps to the console. */
    debug?: boolean;
    /** Max simultaneous registry lookups in {@link validateTaxIds}. Default 5. */
    concurrency?: number;
}

function resolveOptions(options: boolean | ValidateOptions | undefined, debug: boolean): ValidateOptions {
    if (typeof options === 'object' && options !== null) {
        return { ...options, debug: options.debug ?? debug };
    }
    return { online: options === true, debug };
}

/**
 * Result of validating a single tax ID.
 *
 * @example
 * ```typescript
 * const result = await validateTaxId('DE', '123456789');
 * if (typeof result !== 'string' && result.isValid) {
 *     console.log(`Matched: ${result.matchedLabel} (${result.matchedType})`);
 * }
 * ```
 */
export interface TaxIdValidationResult {
    /**
     * Overall validity: regex must match, checksum must pass (when one exists), and — when an
     * online check was requested — the registry must not have answered `invalid`
     * (with `strict: true`, it must have answered `valid`).
     */
    isValid: boolean;
    /** Whether the tax ID matched the country's regex pattern */
    regexValid: boolean;
    /** Whether a checksum algorithm exists for this tax ID type */
    checkSumCheckPresent: boolean;
    /** Result of the checksum validation (false if no checksum exists) */
    checkSum: boolean;
    /** Whether an online verification endpoint exists for this tax ID type */
    onlineCheckPresent: boolean;
    /** True only when the registry confirmed the ID (`onlineStatus === 'valid'`) */
    onlineCheck: boolean;
    /** Detailed outcome of the online check — distinguishes "not registered" from "registry down" */
    onlineStatus: OnlineStatus;
    /** Registered name/address returned by the registry, when available */
    onlineDetails?: OnlineDetails;
    /** Machine-readable reason for `invalid` / `unavailable` (e.g. "MS_UNAVAILABLE", "TIMEOUT") */
    onlineReason?: string;
    /** Tax ID type code that matched (e.g., "vat", "tin", "ein") */
    matchedType?: string;
    /** Human-readable label for the matched type (e.g., "Value Added Tax", "Employer Identification Number") */
    matchedLabel?: string;
}

/**
 * Input item for bulk tax ID validation.
 *
 * @example
 * ```typescript
 * const items: BulkValidationItem[] = [
 *     { countryCode: 'DE', taxId: '123456789' },
 *     { countryCode: 'GB', taxId: '123456789' },
 * ];
 * ```
 */
export interface BulkValidationItem {
    /** ISO 3166-1 alpha-2 country code (e.g., "DE", "GB", "US") */
    countryCode: string;
    /** The tax identification number to validate */
    taxId: string;
}

/**
 * Result of a single item in a bulk validation batch.
 * Extends {@link BulkValidationItem} with the validation result.
 */
export interface BulkValidationResult extends BulkValidationItem {
    /** Validation result, or an error string (e.g., "Country code not found") */
    result: TaxIdValidationResult | string;
}

/**
 * Describes a tax ID type supported by a country.
 *
 * @example
 * ```typescript
 * const types = getTaxIdInfo('DE');
 * if (Array.isArray(types)) {
 *     types.forEach(t => console.log(`${t.label}: checksum=${t.hasChecksum}`));
 * }
 * ```
 */
export interface TaxIdTypeInfo {
    /** Human-readable name of the tax ID type (e.g., "Value Added Tax") */
    label: string;
    /** Short type code used internally (e.g., "vat", "tin") */
    type: string;
    /** Whether a checksum algorithm is available for this type */
    hasChecksum: boolean;
    /** Whether an online verification endpoint is available for this type */
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

const data = rawData as unknown as CountryData[];

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

/**
 * Validates a tax identification number for a given country.
 *
 * Performs regex pattern matching, optional checksum verification, and optional
 * online verification against government endpoints.
 *
 * @param countryCode - ISO 3166-1 alpha-2 country code (e.g., "DE", "US", "GB").
 *   Overseas territories are automatically resolved (e.g., "GF" → "FR").
 * @param taxId - The tax identification number to validate.
 * @param options - `true` to also verify against the country's registry (VIES for EU,
 *   ABN Lookup for AU), or a {@link ValidateOptions} object. Defaults to false.
 * @param debug - When true, logs detailed validation steps to the console. Defaults to false.
 * @returns The validation result, or "Country code not found" if the country is unsupported.
 *
 * @example
 * ```typescript
 * // Basic validation (regex + checksum)
 * const result = await validateTaxId('AT', 'ATU62123456');
 * console.log(result.isValid); // true
 *
 * // With online verification (VIES)
 * const r2 = await validateTaxId('BE', 'BE0417497106', true);
 * console.log(r2.onlineStatus, r2.onlineDetails?.name); // 'valid', 'NV Anheuser-Busch InBev'
 *
 * // In a browser, through a proxy, requiring a positive registry answer
 * await validateTaxId('BE', 'BE0417497106', { online: true, endpoint: 'https://proxy.example/check', strict: true });
 * ```
 */
async function validateTaxId(
    countryCode: string,
    taxId: string,
    options: boolean | ValidateOptions = false,
    debug: boolean = false
): Promise<TaxIdValidationResult | string> {
    const opts = resolveOptions(options, debug);
    debug = opts.debug ?? false;
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
        onlineCheckPresent = entry.online && getOnlineProvider(code) !== null;
        matchedType = entry.type;
        matchedLabel = entry.label;

        if (checkSumCheckPresent) {
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

        }

        break;
    }

    const localValid = regexValid && (!checkSumCheckPresent || checkSumValid);

    let online: OnlineCheckResult = { status: 'not_requested' };
    if (opts.online) {
        if (!localValid) {
            // Don't spend a registry round-trip on an ID that already failed locally
            online = { status: 'skipped' };
        } else if (!onlineCheckPresent && !opts.endpoint) {
            online = { status: 'not_supported' };
        } else {
            online = await checkOnline(code, taxId, opts);
        }
        if (debug) {
            console.log('Online Check Result:', online);
        }
    }

    // Only checks that exist and ran count towards isValid. A registry that could not
    // answer (unavailable) or does not exist (not_supported) does not invalidate an ID
    // that passed regex + checksum — unless `strict` demands a positive confirmation.
    let isValid = localValid;
    if (opts.online && isValid) {
        if (online.status === 'invalid') isValid = false;
        else if (opts.strict && online.status !== 'valid') isValid = false;
    }

    const result: TaxIdValidationResult = {
        isValid,
        regexValid,
        checkSumCheckPresent,
        checkSum: checkSumValid,
        onlineCheckPresent,
        onlineCheck: online.status === 'valid',
        onlineStatus: online.status,
        matchedType,
        matchedLabel
    };
    if (online.details) result.onlineDetails = online.details;
    if (online.reason) result.onlineReason = online.reason;
    return result;
}

/**
 * Validates multiple tax IDs in parallel.
 *
 * @param items - Array of country code / tax ID pairs to validate.
 * @param options - `true` or a {@link ValidateOptions} object to also perform online
 *   verification. Registry lookups are limited to `concurrency` (default 5) at a time,
 *   since VIES rate-limits aggressively.
 * @param debug - When true, logs detailed validation steps. Defaults to false.
 * @returns Array of results in the same order as the input items.
 *
 * @example
 * ```typescript
 * const results = await validateTaxIds([
 *     { countryCode: 'DE', taxId: '123456789' },
 *     { countryCode: 'AT', taxId: 'ATU62123456' },
 * ]);
 * results.forEach(r => console.log(r.countryCode, r.result));
 * ```
 */
async function validateTaxIds(
    items: BulkValidationItem[],
    options: boolean | ValidateOptions = false,
    debug: boolean = false
): Promise<BulkValidationResult[]> {
    const opts = resolveOptions(options, debug);
    const run = (item: BulkValidationItem): Promise<BulkValidationResult> =>
        validateTaxId(item.countryCode, item.taxId, opts).then((result) => ({
            countryCode: item.countryCode,
            taxId: item.taxId,
            result
        }));

    if (!opts.online) return Promise.all(items.map(run));

    const results: BulkValidationResult[] = new Array(items.length);
    let next = 0;
    const worker = async () => {
        while (next < items.length) {
            const i = next++;
            results[i] = await run(items[i]);
        }
    };
    const n = Math.max(1, Math.min(opts.concurrency ?? 5, items.length));
    await Promise.all(Array.from({ length: n }, worker));
    return results;
}

/**
 * Returns all supported ISO 3166-1 alpha-2 country codes, sorted alphabetically.
 *
 * @returns Sorted array of country codes (e.g., ["AT", "BE", "DE", ...]).
 *
 * @example
 * ```typescript
 * const countries = getSupportedCountries();
 * console.log(countries.length); // 76+
 * console.log(countries.includes('US')); // true
 * ```
 */
function getSupportedCountries(): string[] {
    return Array.from(countryMap.keys()).sort();
}

/**
 * Checks whether a country code is supported for tax ID validation.
 * Also returns true for overseas territory codes (e.g., "GF" for French Guiana).
 *
 * @param countryCode - ISO 3166-1 alpha-2 country code.
 * @returns True if the country or territory is supported.
 *
 * @example
 * ```typescript
 * isCountrySupported('DE'); // true
 * isCountrySupported('GF'); // true (maps to France)
 * isCountrySupported('ZZ'); // false
 * ```
 */
function isCountrySupported(countryCode: string): boolean {
    const code = countryCode.toUpperCase();
    return countryMap.has(code) || code in territoryAliases;
}

/**
 * Returns information about the tax ID types supported by a country.
 *
 * @param countryCode - ISO 3166-1 alpha-2 country code.
 * @returns Array of tax ID type descriptors, or "Country code not found" if unsupported.
 *
 * @example
 * ```typescript
 * const info = getTaxIdInfo('DE');
 * if (Array.isArray(info)) {
 *     info.forEach(t => console.log(`${t.label} (${t.type}): checksum=${t.hasChecksum}`));
 * }
 * ```
 */
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
        hasOnlineCheck: entry.online && getOnlineProvider(code) !== null
    }));
}

export { validateTaxId, validateTaxIds, getSupportedCountries, isCountrySupported, getTaxIdInfo, sanitize, maskTaxId, checkOnline };
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
    module.exports.checkOnline = checkOnline;
}
