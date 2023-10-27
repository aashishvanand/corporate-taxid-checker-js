// Main validation function
debug = false
function validate_lu_tva(input, debug=false) {
    // Basic input cleanup and validation
    const value = input.replace(/\s/g, '');
    if (!value) {
      if (debug) {
        console.log("Input is empty after cleanup");
      }
      return false;
    }
    if (value.length !== 8) {
      if (debug) {
        console.log("Invalid length");
      }
      return false;
    }
    if (!/^\d+$/.test(value)) {
      if (debug) {
        console.log("Invalid format: Non-digit character detected");
      }
      return false;
    }
  
    // Split the value into relevant parts
    const front = value.substring(0, value.length - 2);
    const check = value.substring(value.length - 2);
  
    // Validate the checksum
    if (parseInt(front, 10) % 89 !== parseInt(check, 10)) {
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
            msCode: 'LU',
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
  module.exports = {validate_lu_tva, online_check};
} else {
  window.validate_lu_tva = validate_lu_tva;
  window.online_check = online_check;
}
  