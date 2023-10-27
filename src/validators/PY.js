function validate_py_ruc(ruc, debug=false) {
  // Validate input type
  if (typeof ruc !== 'string') {
    if (debug) { console.log("Input must be a string"); }
    return false;
  }

  // Clean the input
  const value = ruc.replace(/\s+/g, '');

  // Check for empty input post-cleanup
  if (!value) {
    if (debug) { console.log("Input is empty after cleanup"); }
    return false;
  }

  // Validate input length
  if (value.length < 5 || value.length > 9) {
    if (debug) { console.log("Invalid length"); }
    return false;
  }

  // Validate input format
  if (!/^\d+$/.test(value)) {
    if (debug) { console.log("Invalid format"); }
    return false;
  }

  // Calculate the sum and validate checksum
  const front = value.substring(0, value.length - 1);
  const reversedDigits = front.split('').reverse().map(Number);
  let sum = 0;

  for (let i = 0; i < reversedDigits.length; i++) {
    sum += reversedDigits[i] * (i + 2);
  }

  const checksum = (11 - (sum % 11)) % 10;

  if (checksum !== parseInt(value.charAt(value.length - 1), 10)) {
    if (debug) { console.log("Invalid checksum"); }
    return false;
  }

  return true;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {validate_py_ruc};
} else {
  window.validate_py_ruc = validate_py_ruc;
}
