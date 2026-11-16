import { weightedSum } from '../utils';

function validate_pl_nip(nip: string, debug: boolean = false): boolean {
  // Validate input type
  if (typeof nip !== 'string') {
    if (debug) { console.log("Input must be a string"); }
    return false;
  }
  
  // Clean the input
  const value = nip.replace(/\s+/g, '');

  // Check for empty input post-cleanup
  if (!value) {
    if (debug) { console.log("Input is empty after cleanup"); }
    return false;
  }

  // Validate input length
  if (value.length !== 10) {
    if (debug) { console.log("Invalid length"); }
    return false;
  }

  // Validate input format
  if (!/^\d{10}$/.test(value)) {
    if (debug) { console.log("Invalid format"); }
    return false;
  }

  // Calculate the weighted sum
  const sum = weightedSum(value, {
    weights: [6, 5, 7, 2, 3, 4, 5, 6, 7],
    modulus: 11,
  });

  // Validate checksum
  if (sum !== parseInt(value.charAt(9), 10)) {
    if (debug) { console.log("Invalid checksum"); }
    return false;
  }

  return true;
}

export { validate_pl_nip };
