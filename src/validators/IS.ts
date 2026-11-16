import { weightedSum } from '../utils';

// Icelandic kennitala: DDMMYY + 2 random digits + check digit + century digit.
// Organizations add 40 to the day (first digit 4-7).
function validate_is_kt(input: string, debug: boolean = false): boolean {
    const value = input.replace(/[\s-]/g, '');

    if (!/^\d{10}$/.test(value)) {
        if (debug) { console.log("Invalid format"); }
        return false;
    }

    let day = parseInt(value.slice(0, 2), 10);
    if (day > 40) day -= 40;
    const month = parseInt(value.slice(2, 4), 10);
    if (day < 1 || day > 31 || month < 1 || month > 12) {
        if (debug) { console.log("Invalid date"); }
        return false;
    }

    if (!'089'.includes(value[9])) {
        if (debug) { console.log("Invalid century digit"); }
        return false;
    }

    const expected = (11 - weightedSum(value.slice(0, 8), [3, 2, 7, 6, 5, 4, 3, 2], 11)) % 11;
    if (expected === 10 || String(expected) !== value[8]) {
        if (debug) { console.log("Invalid checksum"); }
        return false;
    }

    return true;
}

export { validate_is_kt };
