
function validate_tr_vkn(input, debug=false) {
  // Assuming a clean function that removes any non-alphanumeric characters
  // and converts letters to uppercase
  const value = input.replace(/[^\w]/g, '').toUpperCase();

  if (value.length !== 10) {
      if (debug) { console.log("Invalid length"); }
      return false;
  }

  if (!/^\d+$/.test(value)) {
      if (debug) { console.log("Invalid format"); }
      return false;
  }

  const front = value.substring(0, value.length - 1);
  const check = value[value.length - 1];

  let sum = front
    .split('')
    .map((v, i) => (parseInt(v, 10) + 9 - i) % 10)
    .map((v, i) => {
      if (v === 0) {
        return v;
      }
      return (v * Math.pow(2, 9 - i)) % 9 || 9;
    })
    .reduce((acc, v) => acc + v, 0) % 10;

  if (String((10 - sum) % 10) !== check) {
      if (debug) { console.log("Invalid checksum"); }
      return false;
  }

  return true;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {validate_tr_vkn};
} else {
  window.validate_tr_vkn = validate_tr_vkn;
}
