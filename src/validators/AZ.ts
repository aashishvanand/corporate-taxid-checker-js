
function validate_az_vat(vat: string, debug: boolean = false): boolean {
    const validTypes = ['1', '2'];

    const lastDigit = vat[9];
    if (!validTypes.includes(lastDigit)) {
        if (debug) { 
            console.log("Invalid format");
        }
        return false;
    }

    return true;
}

export { validate_az_vat };
