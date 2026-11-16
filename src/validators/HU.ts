import { weightedSum } from '../utils';

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

export { validate_hu_anum };
