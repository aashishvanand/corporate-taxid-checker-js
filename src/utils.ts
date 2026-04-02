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
export function weightedSum(input: string, configOrWeights: WeightedSumConfig | number[], modulusArg?: number): number {
    let weights: number[];
    let modulus: number;
    if (Array.isArray(configOrWeights)) {
        weights = configOrWeights;
        modulus = modulusArg || 0;
    } else {
        weights = configOrWeights.weights;
        modulus = configOrWeights.modulus || 0;
    }
    let sum = 0;
    for (let i = 0; i < input.length; i++) {
        sum += parseInt(input[i], 10) * (weights[i % weights.length]);
    }
    return modulus ? sum % modulus : sum;
}

/**
 * Luhn checksum validation.
 * Returns true if the number passes the Luhn check.
 */
export function luhnChecksumValidate(number: string | number): boolean {
    const arr = (number + '')
        .split('')
        .reverse()
        .map((x) => parseInt(x, 10));
    const lastDigit = arr.splice(0, 1)[0];
    let sum = arr.reduce(
        (acc, value, index) =>
            (index % 2 !== 0 ? acc + value : acc + ((2 * value) % 9) || 9),
        0
    );
    sum += lastDigit;
    return sum % 10 === 0;
}

/**
 * Clean input: uppercase, strip whitespace.
 * Returns [cleanedValue, errorOrNull].
 */
export function clean(input: string): [string, string | null] {
    if (typeof input !== 'string') {
        return ['', 'Input must be a string'];
    }
    const value = input.toUpperCase().replace(/\s/g, '');
    if (!value) {
        return ['', 'Input is empty after cleanup'];
    }
    return [value, null];
}

/**
 * Sanitize a tax ID by stripping common separators (spaces, dashes, dots, slashes)
 * and normalizing to uppercase. More aggressive than clean() for user input.
 */
export function sanitize(input: string): [string, string | null] {
    if (typeof input !== 'string') {
        return ['', 'Input must be a string'];
    }
    const value = input.toUpperCase().replace(/[\s.\-\/]/g, '');
    if (!value) {
        return ['', 'Input is empty after sanitization'];
    }
    return [value, null];
}

/**
 * Mask a tax ID for display, showing only the last `visibleCount` characters.
 * Non-alphanumeric characters (separators) are preserved in place.
 * Example: maskTaxId('ATU62123456', 4) => 'XXXXXXX3456'
 * Example: maskTaxId('20-1234567-01', 4) => 'XX-XXXXXXX-01' (preserving dashes, last 4 alnum)
 */
export function maskTaxId(taxId: string, visibleCount: number = 4, maskChar: string = 'X'): string {
    if (typeof taxId !== 'string' || !taxId) return '';
    if (visibleCount < 0) visibleCount = 0;

    // Find all alphanumeric character positions
    const alnumPositions: number[] = [];
    for (let i = 0; i < taxId.length; i++) {
        if (/[A-Za-z0-9]/.test(taxId[i])) {
            alnumPositions.push(i);
        }
    }

    const maskUpTo = alnumPositions.length - visibleCount;
    const maskedPositions = new Set(alnumPositions.slice(0, Math.max(0, maskUpTo)));

    let result = '';
    for (let i = 0; i < taxId.length; i++) {
        result += maskedPositions.has(i) ? maskChar : taxId[i];
    }
    return result;
}
