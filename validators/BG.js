
function validate_bg_vat(vat, debug=false) {
    if (!['0', '1', '2', '3', '9'].includes(vat[0])) {
        if (debug) { 
            console.log("Invalid format");
        }
        return false;
    }

    if (vat.length === 9) {
        return checkLegal(vat);
    } else {
        return checkOther(vat); // Assuming checkOther is defined elsewhere
    }
}

function checkLegal(vat) {
    const weights = [1, 2, 3, 4, 5, 6, 7, 8];
    const front = vat.slice(0, -1);
    const check = vat.slice(-1);
    
    let sum = weightedSum(front, weights);

    if (sum === 10) {
        sum = weightedSum(front, [3, 4, 5, 6, 7, 8, 9, 10]);
    }

    if (String(sum % 10) !== check) {
        if (debug) { 
            console.log("Invalid checksum");
        }
        return false;
    }

    return true;
}

function checkOther(value) {
    // Utility function: Split string at a given index
    function splitAt(str, index) {
        return [str.substring(0, index), str.substring(index)];
    }

    // Utility function: Calculate the weighted sum of digits in a string
    function weightedSum(str, options) {
        const { modulus, weights } = options;
        let sum = 0;
        for (let i = 0; i < str.length; i++) {
            sum += Number(str[i]) * weights[i];
        }
        return sum % modulus;
    }

    // Main logic for checkOther
    const [front, check] = splitAt(value, -1);
    const sum = 11 - weightedSum(front, {
        modulus: 11,
        weights: [4, 3, 2, 7, 6, 5, 4, 3, 2],
    });

    return String(sum % 10) !== check;
}


function weightedSum(number, weights) {
    let sum = 0;

    for (let i = 0; i < number.length; i++) {
        sum += parseInt(number[i], 10) * weights[i];
    }

    return sum;
}

async function online_check(tin,debug=false) {
    const axios = require('axios');
    
    // Extract the relevant portion of the TIN (excluding the msCode)
    const processedTin = tin.substring(2);
    
    try {
        const response = await axios.post('https://ec.europa.eu/taxation_customs/tin/rest-api/tinRequest', {
            msCode: 'BG',
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

module.exports = { validate_bg_vat, online_check};
