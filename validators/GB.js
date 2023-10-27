

function validate_gb_vat(input, debug=false) {


    if (input.length === 5) {
        if (!/^\d+$/.test(input.substr(2))) { // Check if 'input.substr(2)' is digits only
            if (debug) { console.log("Invalid Format"); }
            return false
        }
        const cvalue = parseInt(input.substr(2), 10);
        if (input.startsWith('GD') && cvalue >= 500) {
            if (debug) { console.log("Invalid Component"); }
            return false
        }
        if (input.startsWith('HA') && cvalue < 500) {
            if (debug) { console.log("Invalid Component"); }
            return false
        }
    } else if (
        input.length === 11 &&
        (input.startsWith('GD8888') || input.startsWith('HA8888'))
    ) {
        if (!/^\d+$/.test(input.substr(6))) { // Check if 'input.substr(6)' is digits only
            if (debug) { console.log("Invalid Format"); }
            return false
        }
        const cvalue = parseInt(input.substr(6, 3), 10);
        if (input.startsWith('GD') && cvalue >= 500) {
            if (debug) { console.log("Invalid Component"); }
            return false
        }
        if (input.startsWith('HA') && cvalue < 500) {
            if (debug) { console.log("Invalid Component"); }
            return false
        }
        if (cvalue % 97 !== parseInt(input.substr(9, 2), 10)) {
            if (debug) { console.log("Invalid Checksum"); }
        return false;
        }
    } else if (input.length === 9 || input.length === 12) {
        if (!/^\d+$/.test(input)) { // Check if 'input' is digits only
            if (debug) { console.log("Invalid Format"); }
            return false
        }

        // Assuming 'weightedSum' function is defined elsewhere and properly imported
        // const sum = weightedSum(input.substr(0, 9), {
        //     weights: [8, 7, 6, 5, 4, 3, 2, 10, 1],
        //     modulus: 97,
        // });

        // For simplicity, let's calculate the weighted sum here directly
        const weights = [8, 7, 6, 5, 4, 3, 2, 10, 1];
        const digits = input.substr(0, 9).split('').map(num => parseInt(num, 10));
        let sum = 0;
        for (let i = 0; i < weights.length; i++) {
            sum += weights[i] * digits[i];
        }
        sum %= 97;

        if (Number(input.substring(0, 3)) >= 100) {
            if (![0, 42, 55].includes(sum)) {
                if (debug) { console.log("Invalid Checksum"); }
        return false;
            }
        } else if (sum !== 0) {
            if (debug) { console.log("Invalid Checksum"); }
        return false;
        }
    } else {
        if (debug) { console.log("Invalid Length"); }
        return false;
    }

    return true;
}

module.exports = { validate_gb_vat };
