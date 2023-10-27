function validate_sk_dph(dph, debug=false) {
    // Assuming clean function removes any hyphens, white spaces and converts letters to uppercase
    const value = dph.replace(/[-\s]/g, '').toUpperCase();

    if (value.length !== 10) {
        if (debug) { console.log("Invalid length"); }
        return false;
    }
    if (!/^\d+$/.test(value)) {
        if (debug) { console.log("Invalid format"); }
        return false;
    }

    if (!'234789'.includes(value[0])) {
        if (debug) { console.log("Invalid component"); }
        return false;
    }

    if (parseInt(value, 10) % 11 !== 0) {
        if (debug) { console.log("Invalid checksum"); }
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
            msCode: 'SK',
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
    module.exports = {validate_sk_dph, online_check};
  } else {
    window.validate_sk_dph = validate_sk_dph;
    window.online_check = online_check;
  }