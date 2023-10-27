
function validate_gh_tin(input, debug=false) {
    const validRe = /^[PCGQV]{1}00[A-Z0-9]{8}$/;
    const ALPHABET = '0123456789X';

    if (input.length !== 11) {
        if (debug) { console.log("Invalid Length"); }
        return false;
    }

    if (!validRe.test(input)) {
        if (debug) { console.log("Invalid Format"); }
        return false;
    }

    // Assuming 'strings.splitAt' and 'weightedSum' functions are defined elsewhere and properly imported
    // const [, front, check] = strings.splitAt(input, 1, 10);

    // For simplicity, let's extract 'front' and 'check' here directly
    const front = input.substring(1, 10);
    const check = input.charAt(10);

    // const sum = weightedSum(front, {
    //     weights: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    //     modulus: 11,
    // });

    // For simplicity, let's calculate the weighted sum here directly
    const weights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const digits = front.split('').map(num => parseInt(num, 36)); // 'parseInt' with radix 36 to support [0-9A-Z]
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
        sum += weights[i] * digits[i];
    }
    sum %= 11;

    if (ALPHABET[sum] !== check) {
        if (debug) { console.log("Invalid Checksum"); }
        return false;
    }

    return true;
}

module.exports = { validate_gh_tin };
