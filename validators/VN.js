function validate_vn_mst(input, debug=false) {
    // Assuming a clean function that removes any non-alphanumeric characters
    const value = input.replace(/\D/g, ''); // Remove non-digits

    if (value.length !== 10 && value.length !== 13) {
        if (debug) { console.log("Invalid length"); }
        return false;
    }

    if (!/^\d+$/.test(value)) {
        if (debug) { console.log("Invalid format"); }
        return false;
    }

    const province = value.substr(0, 2);
    const sequence = value.substr(2, 7);
    const check = value[9];
    const suffix = value.substr(10, 3); // only relevant for 13-character codes

    if (sequence === '0000000' || (value.length === 13 && suffix === '000') || province === '00') {
        if (debug) { console.log("Invalid component"); }
        return false;
    }

    const weights = [31, 29, 23, 19, 17, 13, 7, 5, 3];
    const sum = weightedSum(value.substr(0, 9), weights, 11);

    if (check !== String((10 - sum) % 10)) { // assuming that the sum should be modulo 10
        if (debug) { console.log("Invalid checksum"); }
        return false;
    }

    return true;
}

function weightedSum(number, weights, modulus) {
    let sum = 0;
    for (let i = 0; i < number.length; i++) {
        sum += parseInt(number[i], 10) * weights[i];
    }
    return sum % modulus;
}

module.exports = { validate_vn_mst };
