import { sanitize, maskTaxId } from './utils';
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
    /** Overall validity — true only when all applicable checks (regex, checksum, online) pass */
    isValid: boolean;
    /** Whether the tax ID matched the country's regex pattern */
    regexValid: boolean;
    /** Whether a checksum algorithm exists for this tax ID type */
    checkSumCheckPresent: boolean;
    /** Result of the checksum validation (false if no checksum exists) */
    checkSum: boolean;
    /** Whether an online verification endpoint exists for this tax ID type */
    onlineCheckPresent: boolean;
    /** Result of the online verification (false if not requested or unavailable) */
    onlineCheck: boolean;
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
/**
 * Validates a tax identification number for a given country.
 *
 * Performs regex pattern matching, optional checksum verification, and optional
 * online verification against government endpoints.
 *
 * @param countryCode - ISO 3166-1 alpha-2 country code (e.g., "DE", "US", "GB").
 *   Overseas territories are automatically resolved (e.g., "GF" → "FR").
 * @param taxId - The tax identification number to validate.
 * @param onlineCheckRequired - When true, also verifies the tax ID against
 *   the country's online endpoint (if available). Defaults to false.
 * @param debug - When true, logs detailed validation steps to the console. Defaults to false.
 * @returns The validation result, or "Country code not found" if the country is unsupported.
 *
 * @example
 * ```typescript
 * // Basic validation (regex + checksum)
 * const result = await validateTaxId('AT', 'ATU62123456');
 * console.log(result.isValid); // true
 *
 * // With online verification
 * const result2 = await validateTaxId('DE', '123456789', true);
 * ```
 */
declare function validateTaxId(countryCode: string, taxId: string, onlineCheckRequired?: boolean, debug?: boolean): Promise<TaxIdValidationResult | string>;
/**
 * Validates multiple tax IDs in parallel.
 *
 * @param items - Array of country code / tax ID pairs to validate.
 * @param onlineCheckRequired - When true, also performs online verification. Defaults to false.
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
declare function validateTaxIds(items: BulkValidationItem[], onlineCheckRequired?: boolean, debug?: boolean): Promise<BulkValidationResult[]>;
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
declare function getSupportedCountries(): string[];
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
declare function isCountrySupported(countryCode: string): boolean;
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
declare function getTaxIdInfo(countryCode: string): TaxIdTypeInfo[] | string;
export { validateTaxId, validateTaxIds, getSupportedCountries, isCountrySupported, getTaxIdInfo, sanitize, maskTaxId };
export default validateTaxId;
