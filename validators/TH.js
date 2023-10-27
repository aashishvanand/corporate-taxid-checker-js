function weightedSum(input, config) {
    const { weights, modulus } = config;
    let sum = 0;
    for (let i = 0; i < input.length; i++) {
        sum += parseInt(input[i], 10) * weights[i];
    }
    return sum % modulus;
}

function idnrvalidate(input) {
    // Assuming clean function removes any hyphens, white spaces and converts letters to uppercase
    const value = input.replace(/[-\s]/g, '').toUpperCase();

    if (value.length !== 13) {
        if (debug) { console.log("Invalid length"); }
        return false;
    }
    if (!/^\d+$/.test(value)) {
        if (debug) { console.log("Invalid format"); }
        return false;
    }

    if ('09'.includes(value[0])) {
        if (debug) { console.log("Invalid component"); }
        return false;
    }

    const front = value.substring(0, 12);
    const check = value[12];

    const sum = weightedSum(front, {
        weights: [13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
        modulus: 11,
    });

    if (String((11 - sum) % 10) !== check) {
        if (debug) { console.log("Invalid checksum"); }
        return false;
    }

    return true;
}

function moavalidate(input) {
    // Assuming clean function removes any hyphens, white spaces and converts letters to uppercase
    const value = input.replace(/[-\s]/g, '').toUpperCase();

    if (value.length !== 13) {
        if (debug) { console.log("Invalid length"); }
        return false;
    }
    if (!/^\d+$/.test(value)) {
        if (debug) { console.log("Invalid format"); }
        return false;
    }

    if (value[0] !== '0') {
        if (debug) { console.log("Invalid component"); }
        return false;
    }

    // same sum as IDNR
    return idnrvalidate(input); // reusing logic from idnrvalidate
}

function validate_th_tin(input, debug=false) {
    const v1 = idnrvalidate(input);
    if (v1.isValid) {
        return v1;
    }

    return moavalidate(input);
}


module.exports = { validate_th_tin };
