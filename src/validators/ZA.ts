import { luhnChecksumValidate } from '../utils';

function validate_za_tin(input: string, debug: boolean = false): boolean {
    // Assuming a clean function that removes any non-alphanumeric characters
    const value = input.replace(/\D/g, ''); // Remove non-digits

    if (value.length !== 10) {
        if (debug) { console.log("Invalid length"); }
        return false;
    }

    if (!/^\d+$/.test(value)) {
        if (debug) { console.log("Invalid format"); }
        return false;
    }

    if (!'01239'.includes(value[0])) {
        if (debug) { console.log("Invalid format"); }
        return false;
    }

    if (!luhnChecksumValidate(value)) {
        if (debug) { console.log("Invalid checksum"); }
        return false;
    }

    return true;
}

export { validate_za_tin };
