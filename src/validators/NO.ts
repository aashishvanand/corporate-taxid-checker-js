import { weightedSum, clean } from '../utils';

function validate_no_mva(mva: string, debug: boolean = false): boolean {
  const [value, error] = clean(mva);

  if (error) {
    if (debug) { console.log(error); }
    return false;
  }
  if (value.length !== 12) {
    if (debug) { console.log("Invalid length"); }
    return false;
  }
  if (!/^\d{9}/.test(value)) {
    if (debug) { console.log("Invalid format"); }
    return false;
  }

  const [front, end] = [value.substr(0, 9), value.substr(9)];
  if (end !== 'MVA') {
    if (debug) { console.log("Invalid format"); }
    return false;
  }

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
