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
    sum += parseInt(number[i], 10) * weights[i];
  }
  return sum;
}
function validate_me_pib(pib, debug=false) {
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

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {validate_me_pib};
} else {
  window.validate_me_pib = validate_me_pib;
}
