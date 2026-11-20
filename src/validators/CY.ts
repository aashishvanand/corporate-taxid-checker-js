function validate_cy_vat(vat: string, debug: boolean = false): boolean {

    // Define the alphabet and weights
    var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var weights: Record<string, number> = {
        '0': 1, '1': 0, '2': 5, '3': 7, '4': 9,
        '5': 13, '6': 15, '7': 17, '8': 19, '9': 21,
    };

    // Check if the length of the input is correct
    if (vat.length !== 9) {
        if (debug) {
            console.log("Invalid length");
        }
        return false;
    }

    // VAT numbers starting with "12" are not valid
    if (Number(vat.slice(0, 2)) === 12) {
        if (debug) {
            console.log("Invalid: prefix 12 is not allowed");
        }
        return false;
    }

    // Split the VAT number into the main part and the check character
    var front = vat.slice(0, -1);
    var check = vat.slice(-1);

    // Check if all characters in the main part are digits
    if (!/^\d+$/.test(front)) {
        if (debug) { 
            console.log("Invalid format");
        }
        return false;
    }

    // Check if the check character is valid
    if (!alphabet.includes(check)) {
        if (debug) { 
            console.log("Invalid format");
        }
        return false;
    }

    // Calculate the checksum using the weights
    var sum = 0;
    for (var i = 0; i < front.length; i++) {
        var char = front.charAt(i);
        // If the index is even, use the weight, otherwise use the digit itself
        sum += (i % 2 === 0 ? weights[char] : parseInt(char, 10));
    }

    // Check if the calculated checksum matches the check character
    if (alphabet.charAt(sum % 26) !== check) {
        if (debug) { 
            console.log("Invalid checksum");
        }
        return false;
    }

    return true;
}

export { validate_cy_vat };
