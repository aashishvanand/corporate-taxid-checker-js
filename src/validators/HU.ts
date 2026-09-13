import { weightedSum } from '../utils';
import axios from 'axios';

function validate_hu_anum(input: string, debug: boolean = false): boolean {
  // The regex also accepts the dashed domestic form ("12345678-1-23"); strip the
  // dashes so that form reaches the checksum instead of failing the length check.
  const value = input.replace(/-\d-\d{2}$/, '');

  if (value.length !== 8) {
    if (debug) { console.log("Invalid Length"); }
      return false;
  }

  if (!/^\d+$/.test(value)) {
    if (debug) { console.log("Invalid Format"); }
    return false;
  }

  const sum = weightedSum(value, {
    modulus: 10,
    weights: [9, 7, 3, 1, 9, 7, 3, 1],
  });

  if (sum !== 0) {
    if (debug) { console.log("Invalid Checksum"); }
      return false;
  }

  return true;
}

async function online_check(tin: string, debug: boolean = false): Promise<boolean> {
  // VIES only recognizes the bare 8-digit body: strip the "HU" msCode prefix if
  // present, or the "-C-RR" suffix of the dashed domestic form if present.
  const processedTin = tin.toUpperCase().startsWith('HU')
    ? tin.substring(2)
    : tin.replace(/-\d-\d{2}$/, '');
  
  try {
      const response = await axios.post('https://ec.europa.eu/taxation_customs/tin/rest-api/tinRequest', {
          msCode: 'HU',
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

export { validate_hu_anum, online_check };
