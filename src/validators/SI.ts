import { weightedSum } from '../utils';

function validate_si_ddv(input: string, debug: boolean = false): boolean {
    // Assuming clean function removes any hyphens, white spaces and converts letters to uppercase
    const value = input.replace(/[-\s]/g, '').toUpperCase();

    if (value.length !== 8) {
        if (debug) { console.log("Invalid length"); }
        return false;
    }
    if (!/^\d+$/.test(value)) {
        if (debug) { console.log("Invalid format"); }
        return false;
    }

    const front = value.substring(0, value.length - 1);
    const check = value[value.length - 1];

    const remainder = weightedSum(front, {
        weights: [8, 7, 6, 5, 4, 3, 2],
        modulus: 11,
    });

    const sum = 11 - remainder;

    // When remainder is 0, sum is 11 — no valid check digit exists
    if (sum === 11) {
        if (debug) { console.log("Invalid checksum: no valid check digit"); }
        return false;
    }

    const expected = sum === 10 ? 0 : sum;
    if (String(expected) !== check) {
        if (debug) { console.log("Invalid checksum"); }
        return false;
    }

    return true;
}

export { validate_si_ddv };
