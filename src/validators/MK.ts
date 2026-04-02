import { weightedSum, clean } from '../utils';

function isDigits(input: string): boolean {
  return /^\d+$/.test(input);
}

function validate_mk_edb(edb: string, debug: boolean = false): boolean {
  const [value, error] = clean(edb);

  if (error) {
    if (debug) { console.log(error); }
    return false;
  }
  if (value.length !== 13) {
    if (debug) { console.log("Invalid length"); }
    return false;
  }
  if (!isDigits(value)) {
    if (debug) { console.log("Invalid format: non-digit characters present"); }
    return false;
  }

  const front = value.substring(0, 12);
  const check = value.substring(12, 13); // Last digit

  const sum = 11 - (weightedSum(front, [7, 6, 5, 4, 3, 2]) % 11);

  if (String(sum % 10) !== check) {
    if (debug) { console.log("Invalid checksum"); }
    return false;
  }

  return true;
}

export { validate_mk_edb };
