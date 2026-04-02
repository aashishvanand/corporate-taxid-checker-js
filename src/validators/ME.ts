import { weightedSum, clean } from '../utils';

function isDigits(input: string): boolean {
  return /^\d+$/.test(input);
}

function validate_me_pib(pib: string, debug: boolean = false): boolean {
  const [value, error] = clean(pib);

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

  const front = value.substring(0, value.length - 1);
  const check = value.substring(value.length - 1);

  const sum = weightedSum(front, [8, 7, 6, 5, 4, 3, 2]) % 11;

  if (String(((11 - sum) % 11) % 10) !== check) {
    if (debug) { console.log("Invalid checksum"); }
    return false;
  }

  return true;
}

export { validate_me_pib };
