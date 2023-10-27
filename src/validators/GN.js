
function luhnChecksumValidate(number) {
    let sum = 0;
    let shouldDouble = false;
    // Loop through values starting at the rightmost side
    for (let i = number.length - 1; i >= 0; i--) {
        let digit = parseInt(number.charAt(i), 10);

        if (shouldDouble) {
            if ((digit *= 2) > 9) digit -= 9;
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
}

function validate_gn_nifp(input, debug=false) {

    if (input.length !== 9) {
        if (debug) { console.log("Invalid Length"); }
        return false;
    }

    // For simplicity, we'll use a regular expression to check if the input is all digits
    if (!/^\d+$/.test(input)) {
        if (debug) { console.log("Invalid Format"); }
        return false
    }

    if (!luhnChecksumValidate(input)) {
        if (debug) { console.log("Invalid Checksum"); }
        return false;
    }

    return true;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {validate_gn_nifp};
  } else {
    window.validate_gn_nifp = validate_gn_nifp;
  }
  
