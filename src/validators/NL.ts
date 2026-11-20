import { weightedSum, clean } from '../utils';

function mod97base10Validate(input: string): boolean {
  // Process digit-by-digit to avoid Number overflow for large inputs
  const digits = input
    .split('')
    .map((c) => (Number.isNaN(parseInt(c, 10)) ? String(c.charCodeAt(0) - 55) : c))
    .join('');

  let remainder = 0;
  for (let i = 0; i < digits.length; i++) {
    remainder = (remainder * 10 + parseInt(digits[i], 10)) % 97;
  }
  return remainder === 1;
}
function validate_nl_btw(btw: string, debug: boolean = false): boolean {
  const [value, error] = clean(btw);

  if (error) {
    if (debug) { console.log(error); }
    return false;
  }
  if (value.length !== 12) {
    if (debug) { console.log("Invalid length"); }
    return false;
  }
  const [a, b, c] = [value.substring(0, 9), value.charAt(9), value.substring(10)];

  if (!/^\d+$/.test(a) || !/^\d+$/.test(c)) {
    if (debug) { console.log("Invalid format"); }
    return false;
  }
  if (b !== 'B') {
    if (debug) { console.log("Invalid format"); }
    return false;
  }

  const sum = weightedSum(a, {
    weights: [9, 8, 7, 6, 5, 4, 3, 2, -1],
    modulus: 11,
  });

  if ((sum % 11 !== 0) && !mod97base10Validate(`NL${a}${b}${c}`)) {
    if (debug) { console.log("Invalid checksum"); }
    return false;
  }

  return true;
}

export { validate_nl_btw };
