import { luhnChecksumValidate } from '../utils';
import axios from 'axios';

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

async function online_check(tin: string, debug: boolean = false): Promise<boolean> {
    // Only VAT numbers carry the "SE" msCode prefix; TINs (personnummer/organisationsnummer)
    // are plain digits and must be sent as-is.
    const processedTin = tin.toUpperCase().startsWith('SE') ? tin.substring(2) : tin;

    try {
        const response = await axios.post('https://ec.europa.eu/taxation_customs/tin/rest-api/tinRequest', {
            msCode: 'SE',
            tinNumber: processedTin
        });

        if (response.status !== 200) {
            if (debug) console.log(`Request failed with status: ${response.status}`);
            return false;
        }

        const data = response.data;
        if (data.result.structureValid === true && data.result.syntaxValid === true) {
            return true;
        }

        if (data.result.userError !== "0" || data.result.error === true || data.result.structureValid === false || data.result.syntaxValid === false) {
            if (debug) {
                console.log('Response Data:', data.result);
                if (data.result.userError !== "0") console.log(`User Error with code: ${data.result.userError}`);
                if (data.result.error === true) console.log('Error flag set to true in response');
                if (data.result.structureValid === false) console.log('Structure validity check failed');
                if (data.result.syntaxValid === false) console.log('Syntax validity check failed');
            }
            return false;
        }
    } catch (error) {
        if (debug) console.log('Axios request error:', error);
        console.error(error);
        return false;
    }
    return false;
}

export { validate_se_tin, validate_se_vat, online_check };
