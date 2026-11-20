import { weightedSum } from '../utils';

function validate_au_abn(abn: string, debug: boolean = false): boolean {
    let wSum = 0;
    const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];

    for (let i = 0; i < 11; i++) {
        // Subtract 1 from the first digit (i == 0) and then multiply by the weight
        const digit = (parseInt(abn[i], 10) - (i === 0 ? 1 : 0)) * weights[i];
        wSum += digit;
    }

    if (wSum % 89 !== 0) {
        if (debug) {
            console.log("Invalid checksum");
        }
        return false;
    }

    return true;
}

function validate_au_tfn(tfn: string, debug: boolean = false): boolean {
    const weights = [1, 4, 3, 7, 5, 8, 6, 9, 10];
    const sum = weightedSum(tfn, weights, 11);

    if (sum !== 0) {
        if (debug) {
            console.log("Invalid checksum");
        }
        return false;
    }

    return true;
}

export { validate_au_abn, validate_au_tfn };
