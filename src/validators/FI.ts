import { weightedSum } from '../utils';

function validate_fi_alv(input: string, debug: boolean = false): boolean {

    // Assuming input is already cleaned and in the correct format
    // and that the length check has been done outside this function

    if (!/^\d+$/.test(input)) {
        if (debug) { 
            console.log("Invalid format");
        }
        return false;
    }

    const sum = weightedSum(input, {
        modulus: 11,
        weights: [7, 9, 10, 5, 8, 4, 2, 1],
    });

    if (sum !== 0) {
        if (debug) { 
            console.log("Invalid checksum");
        }
        return false;
    }

    return true;
}

export { validate_fi_alv };
