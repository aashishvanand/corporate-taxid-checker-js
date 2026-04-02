import { weightedSum, clean } from '../utils';

function isDigits(input: string): boolean {
  return /^\d+$/.test(input);
}

function validate_md_idno(md: string, debug: boolean = false): boolean {
  const [value, error] = clean(md);

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

  const front = value.substring(0, value.length - 1);
  const check = value.substring(value.length - 1);

  const sum = weightedSum(front, [7, 3, 1, 7, 3, 1, 7, 3, 1, 7, 3, 1]) % 10;

  if (String(sum) !== check) {
    if (debug) { console.log("Invalid checksum"); }
    return false;
  }

  return true;
}

export { validate_md_idno };
