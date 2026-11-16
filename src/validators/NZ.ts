import { weightedSum } from '../utils';

function validate_nz_ird(ird: string, debug: boolean = false): boolean {
  // Validate input type
  if (typeof ird !== 'string') {
    if (debug) { console.log("Input must be a string"); }
    return false;
  }
  
  // Clean the input
  const value = ird.replace(/\s+/g, '');

  // Check for empty input post-cleanup
  if (!value) {
    if (debug) { console.log("Input is empty after cleanup"); }
    return false;
  }

  // Validate input length
  if (value.length !== 8 && value.length !== 9) {
    if (debug) { console.log("Invalid length"); }
    return false;
  }

  // Validate input format
  if (!/^\d{8,9}$/.test(value)) {
    if (debug) { console.log("Invalid format"); }
    return false;
  }

  const [frontV, check] = [value.slice(0, -1), value.slice(-1)];
  const front = frontV.padStart(8, '0');

  // Check digit = (11 - sum % 11) % 11 with the primary weights; if that gives 10,
  // retry with the secondary weights, and a second 10 means the number is invalid
  let expected = (11 - weightedSum(front, { weights: [3, 2, 7, 6, 5, 4, 3, 2], modulus: 11 })) % 11;
  if (expected === 10) {
    expected = (11 - weightedSum(front, { weights: [7, 4, 3, 2, 5, 2, 7, 6], modulus: 11 })) % 11;
  }

  if (expected === 10 || String(expected) !== check) {
    if (debug) { console.log("Invalid checksum"); }
    return false;
  }

  return true;
}

export { validate_nz_ird };
