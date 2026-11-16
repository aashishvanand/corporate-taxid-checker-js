import { weightedSum, clean } from '../utils';

function validate_no_mva(mva: string, debug: boolean = false): boolean {
  const [value, error] = clean(mva);

  if (error) {
    if (debug) { console.log(error); }
    return false;
  }
  // Accept the bare 9-digit organisation number, optionally followed by "MVA"
  // (the country prefix is stripped by the caller)
  const match = /^(\d{9})(MVA)?$/.exec(value);
  if (!match) {
    if (debug) { console.log("Invalid format"); }
    return false;
  }

  const front = match[1];
  const sum = weightedSum(front, {
    weights: [3, 2, 7, 6, 5, 4, 3, 2, 1],
    modulus: 11,
  });

  if (sum !== 0) {
    if (debug) { console.log("Invalid checksum"); }
    return false;
  }

  return true;
}

export { validate_no_mva };
