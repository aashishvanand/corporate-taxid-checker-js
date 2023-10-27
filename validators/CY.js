function validate_cy_vat(vat, debug=false) {

    // Define the alphabet and weights
    var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var weights = {
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

async function online_check(tin,debug=false) {
    const axios = require('axios');
    
    // Extract the relevant portion of the TIN (excluding the msCode)
    const processedTin = tin.substring(2);
    
    try {
        const response = await axios.post('https://ec.europa.eu/taxation_customs/tin/rest-api/tinRequest', {
            msCode: 'CY',
            tinNumber: processedTin
        });

        if (response.status !== 200) {
            if (debug) console.log(`Request failed with status: ${response.status}`);
            return false;
        }

        const data = response.data;
        if (data.result.structureValid === true && data.result.syntaxValid === true) {
            return true;
        }

        if (data.result.userError !== "0" || data.result.error === true || data.result.structureValid === false || data.result.syntaxValid === false) {
            if (debug) {
                console.log('Response Data:', data.result);
                if (data.result.userError !== "0") console.log(`User Error with code: ${data.result.userError}`);
                if (data.result.error === true) console.log('Error flag set to true in response');
                if (data.result.structureValid === false) console.log('Structure validity check failed');
                if (data.result.syntaxValid === false) console.log('Syntax validity check failed');
            }
            return false;
        }
    } catch (error) {
        if (debug) console.log('Axios request error:', error);
        console.error(error);
        return false;
    }
}

module.exports = { validate_cy_vat, online_check };
