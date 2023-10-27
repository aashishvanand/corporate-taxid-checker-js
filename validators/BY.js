
function validate_by_vat(vat, debug=false) {
    const check = vat.slice(-1);
    const front = vat.slice(0, -1);

    const sum = weightedSum(front, [29, 23, 19, 17, 13, 7, 5, 3], 11);

    if (sum === 10 || sum.toString() !== check) {
        if (debug) { 
            console.log("Invalid checksum");
        }
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

module.exports = { validate_by_vat };
