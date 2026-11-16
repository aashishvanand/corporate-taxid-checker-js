
function validate_hr_oib(oib: string, debug: boolean = false): boolean {
    const value = oib.replace(/\D/g, '');

    if (value.length !== 11) {
        if (debug) { console.log("Invalid length"); }
        return false;
    }

    if (!/^\d+$/.test(value)) {
        if (debug) { console.log("Invalid format"); }
        return false;
    }

    // ISO 7064 MOD 11,10 algorithm
    let check = 10;
    for (let i = 0; i < 10; i++) {
        check = (check + parseInt(value[i], 10)) % 10;
        if (check === 0) check = 10;
        check = (check * 2) % 11;
    }

    const controlDigit = (11 - check) % 10;
    if (controlDigit !== parseInt(value[10], 10)) {
        if (debug) { console.log("Invalid checksum"); }
        return false;
    }

    return true;
}

export { validate_hr_oib };
