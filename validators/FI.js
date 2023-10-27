

function validate_fi_alv(fi, debug=false) {

    // Helper function to calculate weighted sum for checksum
    function weightedSum(number, config) {
        const weights = config.weights;
        const modulus = config.modulus;
        let sum = 0;

        for (let i = 0; i < number.length; i++) {
            sum += parseInt(number[i], 10) * weights[i];
        }

        return sum % modulus;
    }

    // Assuming input is already cleaned and in the correct format
    // and that the length check has been done outside this function

    if (!/^\d+$/.test(input)) {
        if (debug) { 
            console.log("Invalid format");
        }
        return false;
    }

    const sum = weightedSum(input, {
        modulus: 11,
        weights: [7, 9, 10, 5, 8, 4, 2, 1],
    });

    if (sum !== 0) {
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
            msCode: 'FI',
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

module.exports = { validate_fi_alv, online_check };
