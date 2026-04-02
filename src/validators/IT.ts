import { luhnChecksumValidate } from '../utils';
import axios from 'axios';

// Main validation function
function validate_it_iva(iva: string, debug: boolean = false): boolean {
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

  // Reject all-zero first 7 digits
  if (Number(iva.slice(0, 7)) === 0) {
    if (debug) {
      console.log("Invalid: first 7 digits are all zeros");
    }
    return false;
  }

  // Validate office code (provinces 1-201, plus special codes 888, 999)
  const code = parseInt(iva.substr(7, 3), 10);
  if (!(code >= 1 && code <= 201) && code !== 888 && code !== 999) {
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

async function online_check(tin: string, debug: boolean = false): Promise<boolean> {  
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
  return false;
}

export { validate_it_iva, online_check };
