
function validate_ar_cuit(cuit, debug=false) {
    const cuitTypes = ['20', '23', '24', '27', '30', '33', '34', '50', '51', '55'];

    const type = cuit.substring(0, 2);
    if (!cuitTypes.includes(type)) {
        if (debug) { 
            console.log("Invalid component");
        }
        return false;
    }

    const weights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cuit[i], 10) * weights[i];
    }

    const remainder = 11 - (sum % 11);
    const calculatedDigit = remainder === 11 ? '0' : (remainder === 10 ? '9' : remainder.toString());
    const checkDigit = cuit[10];

    if (calculatedDigit !== checkDigit) {
        if (debug) { 
            console.log("Invalid checksum");
        }
        return false;
    }

    return true;
}

module.exports = { validate_ar_cuit };
