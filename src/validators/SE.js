
function luhnChecksumValidate(number) {
    let arr = (number + '')
        .split('')
        .reverse()
        .map((x) => parseInt(x, 10));
    let lastDigit = arr.splice(0, 1)[0];
    let sum = arr.reduce(
        (acc, value, index) =>
            (index % 2 !== 0 ? acc + value : acc + ((2 * value) % 9) || 9),
        0
    );
    sum += lastDigit;
    return sum % 10 === 0;
}

function verify_se_vat(input) {
    // Remove any non-numeric characters
    const value = input.replace(/\D/g, '');

    // Check the length of the input
    if (value.length !== 12) {
        if (debug) { console.log("Invalid length. The input should be 12 digits long."); }
        return false;
    }

    // Check if the input is numeric
    if (!/^\d+$/.test(value)) {
        if (debug) { console.log("Invalid format. The input should contain only digits."); }
        return false;
    }

    // Check the specific format for Swedish VAT numbers
    if (value.slice(-2) !== '01') {
        if (debug) { console.log("Invalid format. Swedish VAT numbers should end with 01."); }
        return false;
    }

    // Validate the number with the Luhn algorithm
    if (!luhnChecksumValidate(value.slice(0, -2))) {
        if (debug) { console.log("Invalid checksum."); }
        return false;
    }

    // If all validations pass, return valid
    return true;
}

async function online_check(tin,debug=false) {
    const axios = require('axios');
    
    // Extract the relevant portion of the TIN (excluding the msCode)
    const processedTin = tin.substring(2);
    
    try {
        const response = await axios.post('https://ec.europa.eu/taxation_customs/tin/rest-api/tinRequest', {
            msCode: 'SE',
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

// Export the function for use in other files
module.exports = { verify_se_vat, online_check };
