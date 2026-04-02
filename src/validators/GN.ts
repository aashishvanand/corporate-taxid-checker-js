import { luhnChecksumValidate } from '../utils';

function validate_gn_nifp(input: string, debug: boolean = false): boolean {

    if (input.length !== 9) {
        if (debug) { console.log("Invalid Length"); }
        return false;
    }

    // For simplicity, we'll use a regular expression to check if the input is all digits
    if (!/^\d+$/.test(input)) {
        if (debug) { console.log("Invalid Format"); }
        return false
    }

    if (!luhnChecksumValidate(input)) {
        if (debug) { console.log("Invalid Checksum"); }
        return false;
    }

    return true;
}

export { validate_gn_nifp };
