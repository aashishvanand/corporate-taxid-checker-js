
function validate_rs_pib(rs: string, debug: boolean = false): boolean {
    // Remove any non-numeric characters
    const value = rs.replace(/\D/g, '');

    // Check the length of the input
    if (value.length !== 9) {
        if (debug) { console.log("Invalid length. The input should be 9 digits long."); }
        return false;
    }

    // Check if the input is numeric
    if (!/^\d+$/.test(value)) {
        if (debug) { console.log("Invalid format. The input should contain only digits."); }
        return false;
    }

    // ISO 7064 MOD 11,10 over all 9 digits (check digit included); valid when the final S is 1
    let product = 10;
    let s = 0;
    for (const ch of value) {
        s = (product + parseInt(ch, 10)) % 10 || 10;
        product = (s * 2) % 11;
    }

    if (s !== 1) {
        if (debug) { console.log("Invalid checksum."); }
        return false;
    }

    // If all validations pass, return valid
    return true;
}

export { validate_rs_pib };
