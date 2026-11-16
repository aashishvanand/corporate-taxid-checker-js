import { luhnChecksumValidate } from '../utils';

// Validates a Swedish personal identity number (personnummer), co-ordination number
// (samordningsnummer), or organisation number (organisationsnummer). All three share the
// same 10-digit structure (YYMMDD-NNNC / NNNNNN-NNNN) with a Luhn check digit — per the
// OECD TIN table for Sweden, this is the actual TIN, not the VAT number.
function validate_se_tin(input: string, debug: boolean = false): boolean {
    // Remove separators (hyphen or plus sign used for centenarians)
    const value = input.replace(/[-+]/g, '');

    if (value.length !== 10) {
        if (debug) { console.log("Invalid length. The input should be 10 digits long."); }
        return false;
    }

    if (!/^\d+$/.test(value)) {
        if (debug) { console.log("Invalid format. The input should contain only digits."); }
        return false;
    }

    if (!luhnChecksumValidate(value)) {
        if (debug) { console.log("Invalid checksum."); }
        return false;
    }

    return true;
}

function validate_se_vat(input: string, debug: boolean = false): boolean {
    // Remove any non-numeric characters
    const value = input.replace(/\D/g, '');

    // Check the length of the input
    if (value.length !== 12) {
        if (debug) { console.log("Invalid length. The input should be 12 digits long."); }
        return false;
    }

    // Check if the input is numeric
    if (!/^\d+$/.test(value)) {
        if (debug) { console.log("Invalid format. The input should contain only digits."); }
        return false;
    }

    // Check the specific format for Swedish VAT numbers
    if (value.slice(-2) !== '01') {
        if (debug) { console.log("Invalid format. Swedish VAT numbers should end with 01."); }
        return false;
    }

    // Validate the number with the Luhn algorithm
    if (!luhnChecksumValidate(value.slice(0, -2))) {
        if (debug) { console.log("Invalid checksum."); }
        return false;
    }

    // If all validations pass, return valid
    return true;
}

export { validate_se_tin, validate_se_vat };
