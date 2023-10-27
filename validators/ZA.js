function validate_za_tin(input, debug=false) {
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

function luhnChecksumValidate(value) {
    let sum = 0;
    let alternate = false;
    for (let i = value.length - 1; i >= 0; i--) {
        let n = parseInt(value[i], 10);
        if (alternate) {
            n *= 2;
            if (n > 9) {
                n = (n % 10) + 1;
            }
        }
        sum += n;
        alternate = !alternate;
    }

    return (sum % 10) === 0;
}

module.exports = { validate_za_tin };
