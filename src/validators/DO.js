
function validate_do_rnc(rnc, debug=false) {
    // Define the weightedSum function used in the validation
    function weightedSum(number, { weights, modulus }) {
        const digits = number.split('').map(num => parseInt(num, 10));
        let sum = 0;

        for (let i = 0; i < weights.length; i++) {
            sum += weights[i] * (digits[i] || 0);
        }

        return sum % modulus;
    }

    // Assuming rnc is already cleaned and in the correct format
    // and that the length check and format check have been done outside this function

    const front = rnc.slice(0, 8);
    const check = rnc.slice(-1);

    const sum = weightedSum(front, {
        weights: [7, 9, 8, 6, 5, 4, 3, 2],
        modulus: 11,
    });

    if (String(((10 - sum) % 9) + 1) !== check) {
        if (debug) { 
            console.log("Invalid checksum");
        }
        return false;
    }

    return true;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {validate_do_rnc};
  } else {
    window.validate_do_rnc = validate_do_rnc;
  }
