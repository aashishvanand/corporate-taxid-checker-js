// Utility to perform weighted sum calculation
function weightedSum(number, { weights, modulus }) {
  let sum = 0;
  for (let i = 0; i < number.length; i++) {
    sum += parseInt(number[i], 10) * weights[i];
  }
  return sum % modulus;
}

// Utility to check if the date is valid
function isValidDate(year, month, day, strict = false) {
  const date = new Date(`${year}-${month}-${day}`);
  if (strict) {
    return (
      date.getFullYear() == year &&
      date.getMonth() + 1 == month &&
      date.getDate() == day
    );
  }
  return date instanceof Date && !isNaN(date);
}

debug = false

// Main validation function
function validate_lv_pvn(input, debug=false) {
  // Basic input cleanup and validation
  const value = input.replace(/\s/g, '');
  if (!value) {
    if (debug) {
      console.log("Input is empty after cleanup");
    }
    return false;
  }
  if (value.length !== 11) {
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

  const isIndividual = '0123'.includes(value[0]);

  if (isIndividual) {
    // Validate birthdate for individuals
    const [dd, mm, yy, century] = [
      value.substr(0, 2),
      value.substr(2, 2),
      value.substr(4, 2),
      value.substr(6, 1),
    ];

    if (!isValidDate(`${18 + parseInt(century, 10)}${yy}`, mm, dd, true)) {
      if (debug) {
        console.log("Invalid date component");
      }
      return false;
    }

    // Validate the checksum for individuals
    const [front, check] = [value.substr(0, value.length - 1), value.substr(value.length - 1)];
    const sum =
      1 +
      weightedSum(front, {
        weights: [10, 5, 8, 4, 2, 1, 6, 3, 7, 9],
        modulus: 11,
      });

    if (String((sum % 11) % 10) !== check) {
      if (debug) {
        console.log("Invalid checksum");
      }
      return false;
    }
  } else {
    // Validate the checksum for non-individuals
    const sum = weightedSum(value, {
      weights: [9, 1, 4, 8, 3, 10, 2, 5, 7, 6, 1],
      modulus: 11,
    });

    if (sum !== 3) {
      if (debug) {
        console.log("Invalid checksum");
      }
      return false;
    }
  }

  return true;
}

async function online_check(tin,debug=false) {
  const axios = require('axios');
  
  // Extract the relevant portion of the TIN (excluding the msCode)
  const processedTin = tin.substring(2);
  
  try {
      const response = await axios.post('https://ec.europa.eu/taxation_customs/tin/rest-api/tinRequest', {
          msCode: 'LV',
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
  module.exports = {validate_lv_pvn, online_check};
} else {
  window.validate_lv_pvn = validate_lv_pvn;
  window.online_check = online_check;
}
