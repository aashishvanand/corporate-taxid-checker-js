
function validate_dk_cvr(cvr, debug=false) {
    // Define the weightedSum function used in the validation
    function weightedSum(number, { modulus, weights }) {
        const digits = number.split('').map(num => parseInt(num, 10));
        let sum = 0;

        for (let i = 0; i < weights.length; i++) {
            sum += weights[i] * (digits[i] || 0);
        }

        return sum % modulus;
    }

    const front = cvr.slice(0, -1);
    const check = cvr.slice(-1);

    const sum = weightedSum(front, {
        modulus: 11,
        weights: [2, 7, 6, 5, 4, 3, 2, 1],
    });

    if (String((11 - sum) % 10) !== check) {
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
            msCode: 'DK',
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

module.exports = { validate_dk_cvr, online_check };
