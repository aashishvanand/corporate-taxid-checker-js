/**
 * Shared utility functions for tax ID validators.
 */
interface WeightedSumConfig {
    weights: number[];
    modulus?: number;
}
/**
 * Calculate weighted sum of digits.
 * Supports two calling conventions:
 *   weightedSum(input, { weights, modulus })  — config object
 *   weightedSum(input, weights, modulus)      — positional args
 */
export declare function weightedSum(input: string, configOrWeights: WeightedSumConfig | number[], modulusArg?: number): number;
/**
 * Luhn checksum validation.
 * Returns true if the number passes the Luhn check.
 */
export declare function luhnChecksumValidate(number: string | number): boolean;
/**
 * Clean input: uppercase, strip whitespace.
 * Returns [cleanedValue, errorOrNull].
 */
export declare function clean(input: string): [string, string | null];
/**
 * Sanitize a tax ID by stripping common separators (spaces, dashes, dots, slashes)
 * and normalizing to uppercase. More aggressive than clean() for user input.
 */
export declare function sanitize(input: string): [string, string | null];
/**
 * Mask a tax ID for display, showing only the last `visibleCount` characters.
 * Non-alphanumeric characters (separators) are preserved in place.
 * Example: maskTaxId('ATU62123456', 4) => 'XXXXXXX3456'
 * Example: maskTaxId('20-1234567-01', 4) => 'XX-XXXXXXX-01' (preserving dashes, last 4 alnum)
 */
export declare function maskTaxId(taxId: string, visibleCount?: number, maskChar?: string): string;
export {};
