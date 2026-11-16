function validate_sk_dph(dph: string, debug: boolean = false): boolean {
    // Assuming clean function removes any hyphens, white spaces and converts letters to uppercase
    const value = dph.replace(/[-\s]/g, '').toUpperCase();

    if (value.length !== 10) {
        if (debug) { console.log("Invalid length"); }
        return false;
    }
    if (!/^\d+$/.test(value)) {
        if (debug) { console.log("Invalid format"); }
        return false;
    }

    if (!'234789'.includes(value[0])) {
        if (debug) { console.log("Invalid component"); }
        return false;
    }

    if (parseInt(value, 10) % 11 !== 0) {
        if (debug) { console.log("Invalid checksum"); }
        return false;
    }

    return true;
}

export { validate_sk_dph };
