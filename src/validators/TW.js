
function validate_tw_ubn(input, debug=false) {
  // Assuming a clean function that removes any non-alphanumeric characters
  // and converts letters to uppercase
  const value = input.replace(/[^\w]/g, '').toUpperCase();

  if (value.length !== 8) {
      if (debug) { console.log("Invalid length"); }
      return false;
  }

  if (!/^\d+$/.test(value)) {
      if (debug) { console.log("Invalid format"); }
      return false;
  }

  const weights = [1, 2, 1, 2, 1, 2, 4, 1];

  const digits = weights
    .map((w, idx) => String(parseInt(value[idx], 10) * w))
    .join('');
  let sum = digits
    .split('')
    .reduce((acc, d) => acc + parseInt(d, 10), 0) % 10;

  if (!(sum === 0 || (sum === 9 && value[6] === '7'))) {
      if (debug) { console.log("Invalid checksum"); }
      return false;
  }

  return true;
}


if (typeof module !== 'undefined' && module.exports) {
  module.exports = {validate_tw_ubn};
} else {
  window.validate_tw_ubn = validate_tw_ubn;
}