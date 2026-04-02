import { weightedSum } from '../utils';

// Main validation function
function validate_kr_brn(kr: string, debug: boolean = false): boolean {
  // Basic input cleanup and validation
  const value = kr.replace(/\s/g, '');
  if (!value) {
    if (debug) {
      console.log("Input is empty after cleanup");
    }
    return false;
  }
  if (value.length !== 10) {
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

  // Validate business registration number components
  const head = value.slice(0, 3);
  const mid = value.slice(3, 5);
  const end = value.slice(5, 9);
  const check = value.slice(9, 10);

  if (parseInt(head, 10) < 101 || mid === '00' || end === '0000') {
    if (debug) {
      console.log("Invalid component");
    }
    return false;
  }

  // Calculate checksum
  const sum = weightedSum(value.substr(0, 9), {
    modulus: 10,
    weights: [1, 3, 7, 1, 3, 7, 1, 3, 5],
  });
  const extra = Math.floor((parseInt(value[8], 10) * 5) / 10);

  // Validate checksum
  if (String((10 - ((sum + extra) % 10)) % 10) !== check) {
    if (debug) {
      console.log("Invalid checksum");
    }
    return false;
  }

  return true;
}

export { validate_kr_brn };
