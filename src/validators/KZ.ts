import { weightedSum } from '../utils';

// Kazakhstan BIN/IIN: 12 digits; check digit = weighted sum mod 11 with weights 1..11,
// falling back to weights 3..11,1,2 when the first pass gives 10 (a second 10 is invalid)
function validate_kz_tin(input: string, debug: boolean = false): boolean {
    const value = input.replace(/\s/g, '');

    if (!/^\d{12}$/.test(value)) {
        if (debug) { console.log("Invalid format"); }
        return false;
    }

    const front = value.slice(0, 11);
    let check = weightedSum(front, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 11);
    if (check === 10) {
        check = weightedSum(front, [3, 4, 5, 6, 7, 8, 9, 10, 11, 1, 2], 11);
    }

    if (check === 10 || String(check) !== value[11]) {
        if (debug) { console.log("Invalid checksum"); }
        return false;
    }

    return true;
}

export { validate_kz_tin };
