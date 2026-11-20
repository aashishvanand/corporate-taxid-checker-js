import { weightedSum } from '../utils';

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

export { validate_lt_pvm };
