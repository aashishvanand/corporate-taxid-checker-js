function validate_co_nit(nit, debug=false) {

    // Check if the length of the input is correct
    if (nit.length < 8 || nit.length > 16) {
        if (debug) { 
            console.log("Invalid length");
        }
        return false;
    }

    // Check if all characters are digits
    if (!/^\d+$/.test(nit)) {
        if (debug) { 
            console.log("Invalid component");
        }
        return false;
    }

    // Extract the main part and the check digit
    var front = nit.slice(0, -1);
    var check = nit.slice(-1);

    // Define the weighted sum function
    function weightedSum(number, config) {
        var weights = config.weights || [1];
        var modulus = config.modulus || 10;
        var reverse = config.reverse || false;

        var digits = number.split('').map(function(num) {
            return parseInt(num, 10);
        });

        if (reverse) {
            digits.reverse();
        }

        var sum = 0;
        for (var i = 0; i < digits.length; i++) {
            sum += (digits[i] * weights[i % weights.length]) % modulus;
        }

        return sum % modulus;
    }

    // Calculating the weighted sum of 'front'
    var sum = weightedSum(front, {
        weights: [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71],
        reverse: true,
        modulus: 11,
    });

    // Mapping the sum to the corresponding check character
    var digit = '01987654321'[sum];

    // Comparing the calculated check character with the provided one
    if (check !== digit) {
        if (debug) { 
            console.log("Invalid checksum");
        }
        return false;
    }

    return true;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {validate_co_nit};
  } else {
    window.validate_co_nit = validate_co_nit;
  }