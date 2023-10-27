
function validate_gr_vat(input, debug=false) {
  const value = input;

  if (value.length !== 9) {
    if (debug) { console.log("Invalid Length"); }
      return false;
  }

  // For simplicity, we'll use a regular expression to check if the input is all digits
  if (!/^\d+$/.test(value)) {
    if (debug) { console.log("Invalid Format"); }
    return false
  }

  const front = value.substring(0, value.length - 1);
  const check = value.substring(value.length - 1);

  const sum = front
    .split('')
    .map(v => parseInt(v, 10))
    .reduce((acc, v) => acc * 2 + v, 0);

  if (String(((sum * 2) % 11) % 10) !== check) {
    if (debug) { console.log("Invalid Checksum"); }
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
          msCode: 'EL',
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

module.exports = { validate_gr_vat, online_check };
