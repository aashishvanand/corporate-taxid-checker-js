
function validate_rs_pib(rs, debug=false) {
    // Remove any non-numeric characters
    const value = input.replace(/\D/g, '');

    // Check the length of the input
    if (value.length !== 9) {
        if (debug) { console.log("Invalid length. The input should be 9 digits long."); }
        return false;
    }

    // Check if the input is numeric
    if (!/^\d+$/.test(value)) {
        if (debug) { console.log("Invalid format. The input should contain only digits."); }
        return false;
    }

    // Define the weights for the Modulus 11 algorithm
    const weights = [7, 6, 5, 4, 3, 2, 7, 6, 5, 4, 3, 2];

    // Calculate the weighted sum of the digits
    let weightedSum = 0;
    for (let i = 0; i < value.length - 1; i++) { // exclude the last digit (checksum)
        weightedSum += parseInt(value[i], 10) * weights[i];
    }

    // Calculate the checksum using the Modulus 11 algorithm
    const checksum = (11 - (weightedSum % 11)) % 10;

    // Validate the checksum
    if (parseInt(value[value.length - 1], 10) !== checksum) {
        if (debug) { console.log("Invalid checksum."); }
        return false;
    }

    // If all validations pass, return valid
    return true;
}


if (typeof module !== 'undefined' && module.exports) {
    module.exports = {validate_rs_pib};
  } else {
    window.validate_rs_pib = validate_rs_pib;
  }