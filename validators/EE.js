
function validate_ee_vat(vat, debug=false) {
    // Assuming vat is already cleaned and in the correct format
    // and that the length check and format check have been done outside this function

    if (!/^\d+$/.test(vat)) { // Checking if the input is all digits
        if (debug) { 
            console.log("Invalid format");
        }
        return false;
    }

    // Perform checksum validation
    const front = vat.substring(0, vat.length - 1);
    const check = vat[vat.length - 1];
    
    const weights = [3, 7, 1, 3, 7, 1, 3, 7]; // weights for the first 8 digits
    let sum = 0;

    for (let i = 0; i < front.length; i++) {
        sum += parseInt(front[i], 10) * weights[i];
    }

    const calculatedCheckDigit = String((10 - sum % 10) % 10);

    if (calculatedCheckDigit !== check) {
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
            msCode: 'EE',
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

module.exports = { validate_ee_vat, online_check };
