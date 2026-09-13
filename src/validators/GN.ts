import { luhnChecksumValidate } from '../utils';

function validate_gn_nifp(input: string, debug: boolean = false): boolean {
    // The regex accepts both "123-456-789" and "123456789"; strip separators
    // before checking length/checksum so the hyphenated form isn't rejected.
    const value = input.replace(/-/g, '');

    if (value.length !== 9) {
        if (debug) { console.log("Invalid Length"); }
        return false;
    }

    // For simplicity, we'll use a regular expression to check if the input is all digits
    if (!/^\d+$/.test(value)) {
        if (debug) { console.log("Invalid Format"); }
        return false
    }

    if (!luhnChecksumValidate(value)) {
        if (debug) { console.log("Invalid Checksum"); }
        return false;
    }

    return true;
}

export { validate_gn_nifp };
