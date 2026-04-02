import { weightedSum } from '../utils';

function validate_sv_nit(input: string, debug: boolean = false): boolean {
    // Assuming clean function removes any hyphens, white spaces and converts letters to uppercase
    const value = input.replace(/[-\s]/g, '').toUpperCase();

    if (value.length !== 14) {
        if (debug) { console.log("Invalid length"); }
        return false;
    }
    if (!/^\d+$/.test(value)) {
        if (debug) { console.log("Invalid format"); }
        return false;
    }
    if (!['0', '1', '9'].includes(value[0])) {
        if (debug) { console.log("Invalid component"); }
        return false;
    }

    let sum;
    const front = value.substring(0, 13);
    const check = value[13];

    if (value.substring(10, 13) === '100') {
        sum = weightedSum(front, {
            weights: [14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2],
            modulus: 11,
        }) % 10;
    } else {
        sum = (11 - weightedSum(front, {
            weights: [2, 7, 6, 5, 4, 3, 2, 7, 6, 5, 4, 3, 2],
            modulus: 11,
        })) % 10;
    }

    if (check !== String(sum)) {
        if (debug) { console.log("Invalid checksum"); }
        return false;
    }

    return true;
}

export { validate_sv_nit };
