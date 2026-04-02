import { weightedSum } from '../utils';
import axios from 'axios';

// Utility to check if the date is valid
function isValidDate(year: string, month: string, day: string, strict: boolean = false): boolean {
  const date = new Date(`${year}-${month}-${day}`);
  if (strict) {
    return (
      date.getFullYear() == Number(year) &&
      date.getMonth() + 1 == Number(month) &&
      date.getDate() == Number(day)
    );
  }
  return date instanceof Date && !isNaN(date.getTime());
}

// Main validation function
function validate_lv_pvn(input: string, debug: boolean = false): boolean {
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
    // Validate the checksum for non-individuals (legal entities)
    const weights = [9, 1, 4, 8, 3, 10, 2, 5, 7, 6];
    let total = 0;
    for (let i = 0; i < 10; i++) {
      total += parseInt(value[i], 10) * weights[i];
    }

    // Special adjustment for numbers starting with 9
    if (total % 11 === 4 && value[0] === '9') {
      total -= 45;
    }

    const remainder = total % 11;
    let checkDigit: number;
    if (remainder === 4) {
      checkDigit = 4 - total;
    } else if (remainder > 4) {
      checkDigit = 14 - remainder;
    } else {
      checkDigit = 3 - remainder;
    }

    if (checkDigit !== parseInt(value[10], 10)) {
      if (debug) {
        console.log("Invalid checksum");
      }
      return false;
    }
  }

  return true;
}

async function online_check(tin: string, debug: boolean = false): Promise<boolean> {  
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
  return false;
}

export { validate_lv_pvn, online_check };
