import { weightedSum } from '../utils';

function validate_by_vat(vat: string, debug: boolean = false): boolean {
    const check = vat.slice(-1);
    const front = vat.slice(0, -1);

    const sum = weightedSum(front, [29, 23, 19, 17, 13, 7, 5, 3], 11);

    if (sum === 10 || sum.toString() !== check) {
        if (debug) { 
            console.log("Invalid checksum");
        }
        return false;
    }

    return true;
}

export { validate_by_vat };
