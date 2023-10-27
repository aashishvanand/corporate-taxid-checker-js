

function validate_ua_edrpou(input, debug=false) {
    // Assuming a clean function that removes any non-alphanumeric characters
    // and converts letters to uppercase
    const value = input.replace(/[^\w]/g, '').toUpperCase();

    if (value.length !== 8) {
        if (debug) { console.log("Invalid length"); }
        return false;
    }

    if (!/^\d+$/.test(value)) {
        if (debug) { console.log("Invalid format"); }
        return false;
    }

    const front = value.substring(0, value.length - 1);
    const check = value[value.length - 1];

    let weights = '345'.includes(front[0])
        ? [7, 1, 2, 3, 4, 5, 6]
        : [1, 2, 3, 4, 5, 6, 7];

    let sum = weightedSum(front, weights, 11);

    if (sum === 10) {
        weights = weights.map(v => v + 2);
        sum = weightedSum(front, weights, 11);
    }

    if (String(sum) !== check) {
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

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {validate_ua_edrpou};
  } else {
    window.validate_ua_edrpou = validate_ua_edrpou;
  }
  
