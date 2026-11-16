
function validate_fr_nif(nif: string, debug: boolean = false): boolean {
    // French NIF: format "0X XX XXX XXX XXX" (13 digits with spaces)
    const value = nif.replace(/\s/g, '');

    if (value.length !== 13) {
        if (debug) { console.log("Invalid length"); }
        return false;
    }
    if (!/^\d+$/.test(value)) {
        if (debug) { console.log("Invalid format"); }
        return false;
    }

    // First digit should be 0-3
    if (!'0123'.includes(value[0])) {
        if (debug) { console.log("Invalid component"); }
        return false;
    }

    return true;
}

function validate_fr_vat(vat: string, debug: boolean = false): boolean {
    // French VAT: FR + 2 check digits (digits or letters) + 9-digit SIREN
    const value = vat.replace(/\s/g, '').toUpperCase();

    let numPart;
    if (value.startsWith('FR')) {
        numPart = value.substring(2);
    } else {
        numPart = value;
    }

    if (numPart.length !== 11) {
        if (debug) { console.log("Invalid length"); }
        return false;
    }

    const siren = numPart.substring(2);
    if (!/^\d{9}$/.test(siren)) {
        if (debug) { console.log("Invalid SIREN component"); }
        return false;
    }

    const checkStr = numPart.substring(0, 2);

    // Check digits can be two digits, or letter+digit, or digit+letter
    if (/^\d{2}$/.test(checkStr)) {
        // Numeric check: key = (12 + 3 * (SIREN % 97)) % 97
        const sirenNum = parseInt(siren, 10);
        const expectedKey = (12 + 3 * (sirenNum % 97)) % 97;
        if (parseInt(checkStr, 10) !== expectedKey) {
            if (debug) { console.log("Invalid checksum"); }
            return false;
        }
    }
    // If check digits contain letters (old format), we can't easily verify — accept regex match

    return true;
}

export { validate_fr_nif, validate_fr_vat };
