import { weightedSum } from '../utils';
import axios from 'axios';

// Checksum validation function
function ikCheck(value: string): boolean {
  const front = value.slice(0, -1);
  const check = value.slice(-1);

  let sum = weightedSum(front, {
    modulus: 11,
    weights: [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6],
  });
  if (sum === 10) {
    sum = weightedSum(front, {
      modulus: 11,
      weights: [3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    });
  }

  return String(sum % 10) === check;
}
// Main validation function
function validate_lt_pvm(input: string, debug: boolean = false): boolean {
  // Basic input cleanup and validation
  const value = input.replace(/\s/g, '');
  if (!value) {
    if (debug) {
      console.log("Input is empty after cleanup");
    }
    return false;
  }
  if (value.length !== 9 && value.length !== 12) {
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

  // Validate VAT code component
  if (value.length === 9 && value[7] !== '1') {
    if (debug) {
      console.log("Invalid component");
    }
    return false;
  }
  if (value.length === 12 && value[10] !== '1') {
    if (debug) {
      console.log("Invalid component");
    }
    return false;
  }

  // Validate using ikCheck function
  if (!ikCheck(value)) {
    if (debug) {
      console.log("Invalid checksum");
    }
    return false;
  }

  return true;
}

async function online_check(tin: string, debug: boolean = false): Promise<boolean> {  
  // Extract the relevant portion of the TIN (excluding the msCode)
  const processedTin = tin.substring(2);
  
  try {
      const response = await axios.post('https://ec.europa.eu/taxation_customs/tin/rest-api/tinRequest', {
          msCode: 'LT',
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

export { validate_lt_pvm, online_check };
