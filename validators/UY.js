function validate_uy_rut(input, debug=false) {
    // Assuming a clean function that removes any non-alphanumeric characters
    // and converts letters to uppercase
    const value = input.replace(/[^\w]/g, '').toUpperCase();

    if (value.length !== 12) {
        if (debug) { console.log("Invalid length"); }
        return false;
    }

    if (!/^\d+$/.test(value)) {
        if (debug) { console.log("Invalid format"); }
        return false;
    }

    if (parseInt(value.substr(0, 2), 10) > 21 || value.substr(0, 2) === '00') {
        if (debug) { console.log("Invalid component"); }
        return false;
    }

    if (value.substr(2, 6) === '000000') {
        if (debug) { console.log("Invalid component"); }
        return false;
    }

    if (value.substr(8, 3) !== '001') {
        if (debug) { console.log("Invalid component"); }
        return false;
    }

    const front = value.substring(0, 11);
    const check = value[11];

    const weights = [4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const sum = weightedSum(front, weights, 11);

    // Assuming a pymod function that replicates the behavior of Python's modulo for negative numbers
    const digit = String(pymod(-sum, 11));

    if (check !== digit) {
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

function pymod(a, b) {
    return ((a % b) + b) % b;
}

module.exports = { validate_uy_rut };
