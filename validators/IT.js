
// Utility to perform Luhn checksum validation
function luhnChecksumValidate(number) {
  let sum = 0;
  let alternate = false;
  for (let i = number.length - 1; i >= 0; i--) {
    let n = parseInt(number.substring(i, i + 1), 10);
    if (alternate) {
      n *= 2;
      if (n > 9) {
        n = (n % 10) + 1;
      }
    }
    sum += n;
    alternate = !alternate;
  }
  return (sum % 10 === 0);
}
// Main validation function
function validate_it_iva(iva, debug=false) {
  // Validate length
  if (iva.length !== 11) {
    if (debug) { 
      console.log("Invalid length");
    }
    return false;
  }

  // Validate digits
  if (!/^\d+$/.test(iva)) {
    if (debug) { 
      console.log("Invalid format");
    }
    return false;
  }

  // Validate office code
  const code = parseInt(iva.substr(7, 3), 10);
  if (!(code >= 1 && code <= 100) && ![120, 121, 888, 999].includes(code)) {
    if (debug) { 
      console.log("Invalid component");
    }
    return false;
  }

  // Validate using Luhn algorithm
  if (!luhnChecksumValidate(iva)) {
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
          msCode: 'IT',
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

module.exports = { validate_it_iva, online_check };
