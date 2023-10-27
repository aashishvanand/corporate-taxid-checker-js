
function isDigits(input) {
  return /^\d+$/.test(input);
}

function clean(input) {
  if (typeof input !== 'string') {
    return ['', 'Input must be a string'];
  }
  const value = input.toUpperCase().replace(/\s/g, '');
  if (!value) {
    return ['', 'Input is empty after cleanup'];
  }
  return [value, null];
}

function weightedSum(number, weights) {
  let sum = 0;
  for (let i = 0; i < number.length; i++) {
    sum += parseInt(number[i], 10) * weights[i];
  }
  return sum;
}
function validate_mt_vat(vat, debug=false) {
  const [value, error] = clean(vat);

  if (error) {
    if (debug) { console.log(error); }
    return false;
  }
  if (value.length !== 8) {
    if (debug) { console.log("Invalid length"); }
    return false;
  }
  if (!isDigits(value)) {
    if (debug) { console.log("Invalid format: non-digit characters present"); }
    return false;
  }

  const sum = weightedSum(value, [3, 4, 6, 7, 8, 9, 10, 1]) % 37;

  if (sum !== 0) {
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
          msCode: 'MT',
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
  module.exports = {validate_mt_vat, online_check};
} else {
  window.validate_mt_vat = validate_mt_vat;
  window.online_check = online_check;
}
