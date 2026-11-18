import rawData from './data.json';
import { sanitize, maskTaxId } from './utils';
import { checkOnline, getOnlineProvider } from './online';
import { validators } from './validators';
import type { ValidatorModule } from './validators';
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

const data = rawData as unknown as CountryData[];

/** Reject absurd input up front: the longest supported formats are ~20 characters. */
const MAX_TAX_ID_LENGTH = 64;

/** Normal result for an unusable input (wrong type, oversized), never a thrown TypeError. */
function invalidInputResult(onlineRequested: boolean): TaxIdValidationResult {
    return {
        isValid: false,
        regexValid: false,
        checkSumCheckPresent: false,
        checkSum: false,
        onlineCheckPresent: false,
        onlineCheck: false,
        onlineStatus: onlineRequested ? 'skipped' : 'not_requested',
    };
}

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
    // Static registry (see `src/validators/index.ts`) so bundlers can tree-shake and
    // Workers/browsers can run the full offline validation without `require`.
    const mod = validators[key] ?? null;
    moduleCache.set(key, mod);
    return mod;
}

/**
 * Inputs a checksum validator may accept for a matched entry.
 *
 * Most validators expect the bare national payload, but the country regex often allows an
 * explicit prefix (e.g. "DE136695976"). Stripping is only safe when the prefix really is
 * part of the format: an ID such as the Indian PAN "INAPL1234C" also starts with its
 * country code, and blindly removing "IN" turns a valid PAN into a failed one. Try the
 * stripped value first (the historical behaviour, needed by validators that do not strip
 * the prefix themselves) and fall back to the value as matched.
 */
function getChecksumCandidates(countryCode: string, taxId: string): string[] {
    // CH handles its own "CHE-" prefix, which is not the ISO code
    if (countryCode === 'CH') return [taxId];
    const separators = /[\s./-]/g;
    const full = taxId.replace(separators, '');
    if (taxId.toUpperCase().startsWith(countryCode)) {
        const stripped = taxId.substring(countryCode.length).replace(separators, '');
        if (stripped && stripped !== full) return [stripped, full];
    }
    return [full];
}

/** Runs an entry's checksum over every candidate input; true if any candidate passes. */
function runEntryChecksum(countryCode: string, entry: CountryEntry, taxId: string, debug: boolean): boolean {
    const countryModule = getValidatorModule(countryCode);
    if (!countryModule) {
        if (debug) console.error('Error loading validator module for', countryCode);
        return false;
    }
    const functionName = `validate_${entry.type}`;
    if (typeof countryModule[functionName] !== 'function') {
        if (debug) console.error('Checksum function not found:', functionName);
        return false;
    }
    for (const candidate of getChecksumCandidates(countryCode, taxId)) {
        try {
            if (countryModule[functionName](candidate, debug) === true) {
                if (debug) console.log('Checksum Validation Result:', true, candidate);
                return true;
            }
        } catch (err) {
            if (debug) console.error('Error in checksum validation', err);
        }
    }
    if (debug) console.log('Checksum Validation Result:', false);
    return false;
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
 * const result = await validateTaxId('AT', 'ATU12345675');
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
    if (typeof countryCode !== 'string' || typeof taxId !== 'string' || taxId.length > MAX_TAX_ID_LENGTH) {
        if (debug) {
            console.log('Invalid input: country code and tax ID must be strings of at most', MAX_TAX_ID_LENGTH, 'characters');
        }
        return invalidInputResult(!!opts.online);
    }
    // User input is routinely lower-case, padded, or pasted with a trailing newline.
    // Normalise before the regex; checksum validators are case-insensitive by contract.
    taxId = taxId.trim().toUpperCase();
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

    // Several entries can match one value (GB historically had a bare-digit eu_vat entry
    // alongside gb_vat). Keep the first match, but prefer a later entry whose checksum
    // passes instead of letting a checksum-less or failing entry short-circuit the loop.
    const matches: Array<{
        entry: CountryEntry;
        checkSumCheckPresent: boolean;
        checkSumValid: boolean;
    }> = [];
    for (const entry of countryData.data) {
        const regex = getCompiledRegex(entry.regex);
        if (!regex || !regex.test(taxId)) continue;

        const hasChecksum = entry.checksum;
        const checksumPassed = hasChecksum ? runEntryChecksum(code, entry, taxId, debug) : false;
        if (debug) {
            console.log('Entity Type', entry.type);
            console.log('Regex Match:', true);
            console.log('Checksum Validation Required:', hasChecksum);
        }
        matches.push({ entry, checkSumCheckPresent: hasChecksum, checkSumValid: checksumPassed });

        // A passing checksum is the best possible outcome. Otherwise keep looking: an
        // overlapping entry may carry the checksum this one lacks.
        if (checksumPassed) break;
    }

    // Prefer a match that actually proves the check digit; then a match with no checksum
    // to run; only then a failed checksum (which leaves the ID invalid).
    const chosen = matches.find((m) => m.checkSumCheckPresent && m.checkSumValid)
        ?? matches.find((m) => !m.checkSumCheckPresent)
        ?? matches[0];
    if (chosen) {
        regexValid = true;
        checkSumCheckPresent = chosen.checkSumCheckPresent;
        checkSumValid = chosen.checkSumValid;
        onlineCheckPresent = !!(chosen.entry.online && getOnlineProvider(code) !== null);
        matchedType = chosen.entry.type;
        matchedLabel = chosen.entry.label;
    }

    const localValid = regexValid && (!checkSumCheckPresent || checkSumValid);

    let online: OnlineCheckResult = { status: 'not_requested' };
    if (opts.online) {
        if (!localValid) {
            // Don't spend a registry round-trip on an ID that already failed locally
            online = { status: 'skipped' };
        } else if (!onlineCheckPresent) {
            // `endpoint` is only a transport for browser use; it does not make an ID type
            // checkable. Otherwise a personal code (e.g. IT Codice Fiscale) would be sent to
            // VIES as a VAT number, come back "invalid", and wrongly fail validation.
            online = { status: 'not_supported' };
        } else {
            online = await checkOnline(code, taxId, opts);
        }
        if (debug) {
            // Do not print registry details: they contain the trader's name and address.
            console.log('Online Check Result:', online.status, online.reason ?? '');
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
    if (!Array.isArray(items)) return [];
    const run = (item: BulkValidationItem): Promise<BulkValidationResult> => {
        // A malformed item must not reject the whole batch.
        const countryCode = item && typeof item.countryCode === 'string' ? item.countryCode : '';
        const taxId = item && typeof item.taxId === 'string' ? item.taxId : '';
        return validateTaxId(countryCode, taxId, opts).then((result) => ({
            countryCode,
            taxId,
            result
        }));
    };

    if (!opts.online) return Promise.all(items.map(run));

    const results: BulkValidationResult[] = [];
    let next = 0;
    const worker = async () => {
        while (next < items.length) {
            const i = next++;
            results[i] = await run(items[i]);
        }
    };
    const requested = opts.concurrency;
    const limit = typeof requested === 'number' && Number.isInteger(requested) && requested > 0 ? requested : 5;
    const n = Math.max(1, Math.min(limit, items.length));
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
    if (typeof countryCode !== 'string') return false;
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
    if (typeof countryCode !== 'string') return 'Country code not found';
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
        hasOnlineCheck: !!(entry.online && getOnlineProvider(code) !== null)
    }));
}

export { validateTaxId, validateTaxIds, getSupportedCountries, isCountrySupported, getTaxIdInfo, sanitize, maskTaxId, checkOnline };
export default validateTaxId;
