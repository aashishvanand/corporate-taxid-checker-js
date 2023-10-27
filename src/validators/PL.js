
function weightedSum(input, config) {
  const { weights, modulus } = config;
  let sum = 0;
  for (let i = 0; i < input.length; i++) {
    sum += parseInt(input[i], 10) * weights[i];
  }
  return sum % modulus;
}

function validate_pl_nip(nip, debug=false) {
  // Validate input type
  if (typeof nip !== 'string') {
    if (debug) { console.log("Input must be a string"); }
    return false;
  }
  
  // Clean the input
  const value = nip.replace(/\s+/g, '');

  // Check for empty input post-cleanup
  if (!value) {
    if (debug) { console.log("Input is empty after cleanup"); }
    return false;
  }

  // Validate input length
  if (value.length !== 10) {
    if (debug) { console.log("Invalid length"); }
    return false;
  }

  // Validate input format
  if (!/^\d{10}$/.test(value)) {
    if (debug) { console.log("Invalid format"); }
    return false;
  }

  // Calculate the weighted sum
  const sum = weightedSum(value, {
    weights: [6, 5, 7, 2, 3, 4, 5, 6, 7],
    modulus: 11,
  });

  // Validate checksum
  if (sum !== parseInt(value.charAt(9), 10)) {
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
          msCode: 'PL',
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
  module.exports = {validate_pl_nip, online_check};
} else {
  window.validate_pl_nip = validate_pl_nip;
  window.online_check = online_check;
}
