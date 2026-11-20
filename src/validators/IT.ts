import { luhnChecksumValidate } from '../utils';

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

export { validate_it_iva };
