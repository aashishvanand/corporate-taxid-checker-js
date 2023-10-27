
function validate_al_nipt(nipt, debug=false) {
    // Extract components of the nipt
    const firstDigit = parseInt(nipt[0], 10);
    const lastDigit = parseInt(nipt[9], 10);

    // Perform checks on the first digit
    if (firstDigit !== 1 && firstDigit !== 2 && firstDigit !== 3 && firstDigit !== 4 && firstDigit !== 5 && firstDigit !== 6 && firstDigit !== 7 && firstDigit !== 8 && firstDigit !== 9) {
        if (debug) { 
        console.log("Invalid component: first digit");
        }
        return false;
    }

    // Calculate checksum
    let weightedSum = 0;
    const weights = [16, 17, 18, 19, 20, 21, 22, 23, 24];
    
    for (let i = 0; i < 9; i++) {
        weightedSum += parseInt(nipt[i], 10) * weights[i];
    }

    const remainder = weightedSum % 26;
    const calculatedCheckDigit = (remainder + 10) % 26;

    // Compare the calculated check digit with the actual last digit
    if (calculatedCheckDigit !== lastDigit) {
        if (debug) { 
            console.log("Invalid checksum");
            }
        return false;
    }

    return true;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {validate_al_nipt};
} else {
    window.validate_al_nipt = validate_al_nipt;
}