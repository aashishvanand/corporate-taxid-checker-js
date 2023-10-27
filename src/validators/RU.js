
function validate_ru_inn(input, debug=false) {
    // Remove any non-numeric characters
    const value = input.replace(/\D/g, '');

    // Check the length of the input
    if (value.length !== 10 && value.length !== 12) {
        if (debug) { console.log("Invalid length. The input should be 10 or 12 digits long."); }
        return false;
    }

    // Check if the input is numeric
    if (!/^\d+$/.test(value)) {
        if (debug) { console.log("Invalid format. The input should contain only digits."); }
        return false;
    }

    let checksum;
    if (value.length === 10) {
        const weights = [2, 4, 10, 3, 5, 9, 4, 6, 8];
        checksum = value.split('').slice(0, 9).reduce((sum, digit, index) => sum + (parseInt(digit, 10) * weights[index]), 0) % 11 % 10;
        if (checksum !== parseInt(value[9], 10)) {
            if (debug) { console.log("Invalid checksum."); }
        return false;
        }
    } else {
        const weights1 = [7, 2, 4, 10, 3, 5, 9, 4, 6, 8];
        const weights2 = [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8];
        const checksum1 = value.split('').slice(0, 10).reduce((sum, digit, index) => sum + (parseInt(digit, 10) * weights1[index]), 0) % 11 % 10;
        const checksum2 = value.split('').slice(0, 11).reduce((sum, digit, index) => sum + (parseInt(digit, 10) * weights2[index]), 0) % 11 % 10;
        if (checksum1 !== parseInt(value[10], 10) || checksum2 !== parseInt(value[11], 10)) {
            if (debug) { console.log("Invalid checksum."); }
        return false;
        }
    }

    // If all validations pass, return valid
    return true;
}

// Export the function for use in other files
module.exports = { validate_ru_inn };
