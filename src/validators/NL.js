
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

function weightedSum(input, config) {
  const { weights, modulus } = config;
  let sum = 0;
  for (let i = 0; i < input.length; i++) {
    sum += parseInt(input[i], 10) * weights[i];
  }
  return sum % modulus;
}

function mod97base10Validate(input) {
  const remainder = input
    .split('')
    .map((c) => (Number.isNaN(parseInt(c, 10)) ? c.charCodeAt(0) - 55 : c))
    .join('') % 97;
  return remainder === 1;
}
debug = false
function validate_nl_btw(btw, debug=false) {
  const [value, error] = clean(btw);

  if (error) {
    if (debug) { console.log(error); }
    return false;
  }
  if (value.length !== 12) {
    if (debug) { console.log("Invalid length"); }
    return false;
  }
  const [a, b, c] = [value.substring(0, 9), value.charAt(9), value.substring(10)];

  if (!/^\d+$/.test(a) || !/^\d+$/.test(c)) {
    if (debug) { console.log("Invalid format"); }
    return false;
  }
  if (b !== 'B') {
    if (debug) { console.log("Invalid format"); }
    return false;
  }

  const sum = weightedSum(a, {
    weights: [9, 8, 7, 6, 5, 4, 3, 2, -1],
    modulus: 11,
  });

  if ((sum % 11 !== 0) && !mod97base10Validate(`NL${a}${b}${c}`)) {
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
          msCode: 'NL',
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

module.exports = { validate_nl_btw, online_check };
