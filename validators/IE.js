
const ALPHABET = 'WABCDEFGHIJKLMNOPQRSTUV';
  
function calcCheckDigit(valueIn) {
  const value = valueIn.padStart(7, '0');
  const d1 = value
    .substr(0, 7)
    .split('')
    .reduce((acc, vv, idx) => {
      const v = Number.parseInt(vv, 10);

      return acc + (8 - idx) * v;
    }, 0);

  const d2 = value.length === 8 ? 9 * ALPHABET.indexOf(value[7]) : 0;

  return ALPHABET[(d1 + d2) % 23];
}

function validate_ie_vat(input,debug=false) {
  const value = input;

  if (value.length !== 8 && value.length !== 9) {
    if (debug) { console.log("Invalid Length"); }
      return false;
  }

  if (!/^\d/.test(value[0]) || !/^\d{5}$/.test(value.substr(2, 5))) {
    if (debug) { console.log("Invalid Format"); }
    return false;
  }

  const front = value.substr(0, 7);
  const end = value.substr(7);

  if (![...end].every(v => ALPHABET.includes(v))) {
    if (debug) { console.log("Invalid Format"); }
    return false;
  }

  if (/^\d+$/.test(front)) {
    // 7 digits followed by 1 or 2 letters
    if (value[7] !== calcCheckDigit(`${front}${value.substr(8)}`)) {
      if (debug) { console.log("Invalid Checksum"); }
      return false;
    }
  } else if ('ABCDEFGHIJKLMNOPQRSTUVWXYZ+*'.includes(value[1])) {
    // old system, second character is a letter
    if (value[7] !== calcCheckDigit(`${value.substr(2, 5)}${value[0]}`)) {
      if (debug) { console.log("Invalid Checksum"); }
      return false;
    }
  } else {
    if (debug) { console.log("Invalid Format"); }
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
          msCode: 'IE',
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

module.exports = { validate_ie_vat, online_check };
