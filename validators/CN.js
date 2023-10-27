
function validate_cn_uscc(uscc, debug=false) {


    // Define the alphabet for the check digit calculation
    var alphabet = '0123456789ABCDEFGHJKLMNPQRTUWXY';

    // Check if the length of the input is correct
    if (uscc.length !== 18) {
        if (debug) { 
            console.log("Invalid length");
        }
        return false;
    }

    // Extracting the different parts of the input
    var front = uscc.substring(0, 8);
    var back = uscc.substring(8, 17);
    var check = uscc[17];

    // Verifying if 'front' part consists only of digits
    if (!/^\d+$/.test(front)) {
        if (debug) { 
            console.log("Invalid format");
        }
        return false;
    }

    // Checking if every character in 'back' is part of the alphabet
    for (var i = 0; i < back.length; i++) {
        if (!alphabet.includes(back[i])) {
            if (debug) { 
                console.log("Invalid format");
            }
            return false;
        }
    }

    // Defining the weighted sum function
    function weightedSum(number, config) {
        var weights = config.weights || [1];
        var modulus = config.modulus || 10;
        var alphabet = config.alphabet || '0123456789';

        var digits = number.split('').map(function (num) {
            return alphabet.indexOf(num);
        });

        var sum = 0;
        for (var i = 0; i < digits.length; i++) {
            sum += (digits[i] * weights[i % weights.length]) % modulus;
        }

        return sum % modulus;
    }

    // Calculating the weighted sum of the first 17 characters
    var digit = weightedSum(uscc.substr(0, 17), {
        weights: [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28],
        modulus: 31,
        alphabet: alphabet,
    });

    // Comparing the calculated check digit with the provided one
    if (alphabet[31 - digit] !== check) {
        if (debug) { 
            console.log("Invalid checksum");
        }
        return false;
    }

    return true;
}

module.exports = { validate_cn_uscc };