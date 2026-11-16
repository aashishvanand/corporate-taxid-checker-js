import { weightedSum, clean } from '../utils';

function isDigits(input: string): boolean {
  return /^\d+$/.test(input);
}

function validate_mt_vat(vat: string, debug: boolean = false): boolean {
  const [value, error] = clean(vat);

  if (error) {
    if (debug) { console.log(error); }
    return false;
  }
  if (value.length !== 8) {
    if (debug) { console.log("Invalid length"); }
    return false;
  }
  if (!isDigits(value)) {
    if (debug) { console.log("Invalid format: non-digit characters present"); }
    return false;
  }

  const sum = weightedSum(value, [3, 4, 6, 7, 8, 9, 10, 1]) % 37;

  if (sum !== 0) {
    if (debug) { console.log("Invalid checksum"); }
    return false;
  }

  return true;
}

export { validate_mt_vat };
