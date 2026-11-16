import { weightedSum } from '../utils';

function validate_dk_cvr(cvr: string, debug: boolean = false): boolean {
    const front = cvr.slice(0, -1);
    const check = cvr.slice(-1);

    const sum = weightedSum(front, {
        modulus: 11,
        weights: [2, 7, 6, 5, 4, 3, 2, 1],
    });

    if (String((11 - sum) % 10) !== check) {
        if (debug) { 
            console.log("Invalid checksum");
        }
        return false;
    }

    return true;
}

export { validate_dk_cvr };
