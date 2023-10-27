function validate_cl_rut(rut, debug=false) {

    // Extracting the front part and the check digit from the input
    var front = rut.substring(0, rut.length - 1);
    var check = rut[rut.length - 1];

    // Verifying if 'front' part consists only of digits
    if (!/^\d+$/.test(front)) {
        if (debug) { 
            console.log("Invalid component");
        }
        return false;
    }

    // Defining the weighted sum function
    function weightedSum(number, config) {
        var reverse = config.reverse || false;
        var weights = config.weights || [1];
        var modulus = config.modulus || 10;

        var digits = number.split('').map(function (num) {
            return parseInt(num, 10);
        });
        if (reverse) {
            digits = digits.reverse();
        }

        var sum = 0;
        for (var i = 0; i < digits.length; i++) {
            sum += (digits[i] * weights[i % weights.length]) % modulus;
        }

        return sum % modulus;
    }

    // Calculating the weighted sum of 'front' part
    var sum = weightedSum(front, {
        reverse: true,
        weights: [9, 8, 7, 6, 5, 4, 9, 8, 7],
        modulus: 11,
    });

    // Calculating the corresponding check digit
    var digit = '0123456789K'[sum];

    // Comparing the calculated check digit with the provided one
    if (check !== digit) {
        if (debug) { 
            console.log("Invalid checksum");
        }
        return false;
    }

    return true;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {validate_cl_rut};
  } else {
    window.validate_cl_rut = validate_cl_rut;
  }