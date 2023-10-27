
function isDigits(input) {
  return /^\d+$/.test(input);
}

function clean(input) {
  if (typeof input !== 'string') {
    return ['', 'Input must be a string'];
  }
  const value = input.toUpperCase().replace(/\s/g, '');
  if (!value) {
    return ['', 'Input is empty after cleanup'];
  }
  return [value, null];
}

function weightedSum(number, weights) {
  let sum = 0;
  for (let i = 0; i < number.length; i++) {
    sum += parseInt(number[i], 10) * weights[i % weights.length]; // Repeating weights after every 6 digits
  }
  return sum;
}

function validate_mk_edb(edb, debug=false) {
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

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {validate_mk_edb};
} else {
  window.validate_mk_edb = validate_mk_edb;
}
