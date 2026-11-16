
function validate_ee_vat(vat: string, debug: boolean = false): boolean {
    // Assuming vat is already cleaned and in the correct format
    // and that the length check and format check have been done outside this function

    if (!/^\d+$/.test(vat)) { // Checking if the input is all digits
        if (debug) { 
            console.log("Invalid format");
        }
        return false;
    }

    // Perform checksum validation
    const front = vat.substring(0, vat.length - 1);
    const check = vat[vat.length - 1];
    
    const weights = [3, 7, 1, 3, 7, 1, 3, 7]; // weights for the first 8 digits
    let sum = 0;

    for (let i = 0; i < front.length; i++) {
        sum += parseInt(front[i], 10) * weights[i];
    }

    const calculatedCheckDigit = String((10 - sum % 10) % 10);

    if (calculatedCheckDigit !== check) {
        if (debug) { 
            console.log("Invalid checksum");
        }
        return false;
    }

    return true;
}

export { validate_ee_vat };
