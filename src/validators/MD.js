
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
debug = false
function validate_md_idno(md, debug=false) {
  const [value, error] = clean(idno);

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

module.exports = { validate_md_idno };
