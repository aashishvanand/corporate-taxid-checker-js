import { weightedSum } from '../utils';

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

export { validate_pt_nif };
