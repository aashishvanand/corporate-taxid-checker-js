
function validate_be_vat(vat: string, debug: boolean = false): boolean {
    // Strip BE prefix if present
    let value = vat.toUpperCase();
    if (value.startsWith('BE')) {
        value = value.substring(2);
    }

    const mod97 = 97;
    const front = value.slice(0, -2);
    const check = value.slice(-2);

    if ((mod97 - (parseInt(front, 10) % mod97)) !== parseInt(check, 10)) {
        if (debug) {
            console.log("Invalid checksum");
        }
        return false;
    }

    return true;
}

export { validate_be_vat };
