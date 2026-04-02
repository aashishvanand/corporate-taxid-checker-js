import { weightedSum } from '../utils';
import axios from 'axios';

function validate_pt_nif(nif: string, debug: boolean = false): boolean {
  // Validate input type
  if (typeof nif !== 'string') {
    if (debug) { console.log("Input must be a string"); }
    return false;
  }

  // Clean the input
  const value = nif.replace(/\s+/g, '');

  // Check for empty input post-cleanup
  if (!value) {
    if (debug) { console.log("Input is empty after cleanup"); }
    return false;
  }

  // Validate input length
  if (value.length !== 9) {
    if (debug) { console.log("Invalid length"); }
    return false;
  }

  // Validate input format
  if (!/^[1-9]\d{8}$/.test(value)) { // The first digit should not be '0'
    if (debug) { console.log("Invalid format"); }
    return false;
  }

  // Calculate the weighted sum
  const sum = weightedSum(value.substring(0, value.length - 1), {
    weights: [9, 8, 7, 6, 5, 4, 3, 2],
    modulus: 11,
  });

  // Validate checksum
  const raw = 11 - sum;
  const checksum = raw > 9 ? 0 : raw;
  if (checksum !== parseInt(value.charAt(8), 10)) {
    if (debug) { console.log("Invalid checksum"); }
    return false;
  }

  return true;
}

async function online_check(tin: string, debug: boolean = false): Promise<boolean> {  
  // Extract the relevant portion of the TIN (excluding the msCode)
  const processedTin = tin.substring(2);
  
  try {
      const response = await axios.post('https://ec.europa.eu/taxation_customs/tin/rest-api/tinRequest', {
          msCode: 'PT',
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

export { validate_pt_nif, online_check };
