
function validate_gr_vat(input, debug=false) {
  const value = input;

  if (value.length !== 9) {
    if (debug) { console.log("Invalid Length"); }
      return false;
  }

  // For simplicity, we'll use a regular expression to check if the input is all digits
  if (!/^\d+$/.test(value)) {
    if (debug) { console.log("Invalid Format"); }
    return false
  }

  const front = value.substring(0, value.length - 1);
  const check = value.substring(value.length - 1);

  const sum = front
    .split('')
    .map(v => parseInt(v, 10))
    .reduce((acc, v) => acc * 2 + v, 0);

  if (String(((sum * 2) % 11) % 10) !== check) {
    if (debug) { console.log("Invalid Checksum"); }
      return false;
  }

  return true;
}

module.exports = { validate_gr_vat };
