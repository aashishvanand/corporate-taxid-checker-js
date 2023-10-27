
function validate_si_ddv(input, debug=false) {
    // Assuming clean function removes any hyphens, white spaces and converts letters to uppercase
    const value = input.replace(/[-\s]/g, '').toUpperCase();

    if (value.length !== 8) {
        if (debug) { console.log("Invalid length"); }
        return false;
    }
    if (!/^\d+$/.test(value)) {
        if (debug) { console.log("Invalid format"); }
        return false;
    }

    const front = value.substring(0, value.length - 1);
    const check = value[value.length - 1];

    const sum = 11 - weightedSum(front, {
        weights: [8, 7, 6, 5, 4, 3, 2, 1],
        modulus: 11,
    });

    if (String(sum % 10) !== check) {
        if (debug) { console.log("Invalid checksum"); }
        return false;
    }

    return true;
}

function weightedSum(input, config) {
    const { weights, modulus } = config;
    let sum = 0;
    for (let i = 0; i < input.length; i++) {
        sum += parseInt(input[i], 10) * weights[i];
    }
    return sum % modulus;
}

async function online_check(tin,debug=false) {
    const axios = require('axios');
    
    // Extract the relevant portion of the TIN (excluding the msCode)
    const processedTin = tin.substring(2);
    
    try {
        const response = await axios.post('https://ec.europa.eu/taxation_customs/tin/rest-api/tinRequest', {
            msCode: 'SI',
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

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {validate_si_ddv, online_check};
  } else {
    window.validate_si_ddv = validate_si_ddv;
    window.online_check = online_check;
  }