import { weightedSum } from '../utils';

function validate_dk_cvr(cvr: string, debug: boolean = false): boolean {
    if (!/^\d{8}$/.test(cvr)) {
        if (debug) { console.log("Invalid format"); }
        return false;
    }

    // Valid when the weighted sum of all 8 digits (check digit weight 1) is divisible by 11
    const sum = weightedSum(cvr, {
        modulus: 11,
        weights: [2, 7, 6, 5, 4, 3, 2, 1],
    });

    if (sum !== 0) {
        if (debug) { 
            console.log("Invalid checksum");
        }
        return false;
    }

    return true;
}

export { validate_dk_cvr };
