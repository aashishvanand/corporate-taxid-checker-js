
function validate_il_hp(input, debug=false) {
  const value = input;

  // Checks if the input has the valid length of 8 or 9 digits
  if (value.length !== 8 && value.length !== 9) {
    if (debug) { console.log("Invalid Length"); }
      return false;
  }

  // Checks if the input is a digit
  if (!/^\d+$/.test(value)) {
    if (debug) { console.log("Invalid Format"); }
    return false
  }

  // Perform any specific checksum validation if required here
  // ...

  return true;
}

module.exports = { validate_il_hp };
