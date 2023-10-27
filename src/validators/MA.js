// Utility to perform Modulus 97 validation for a base 10 number
function mod97base10Validate(number, checkDigitsPosition) {
  const weight = Math.pow(10, checkDigitsPosition + 2);
  return parseInt(number, 10) % 97 === weight % 97;
}
debug = false
// Main validation function for ICE (15 digits)
function validate_ma_ice(input, debug=false) {
  // Basic input cleanup and validation
  const value = input.replace(/\s/g, '');
  if (!value) {
    if (debug) {
      console.log("Input is empty after cleanup");
    }
    return false;
  }
  if (value.length !== 15) {
    if (debug) {
      console.log("Invalid length");
    }
    return false;
  }
  if (!/^\d+$/.test(value)) {
    if (debug) {
      console.log("Invalid format: Non-digit character detected");
    }
    return false;
  }

  // Validate using Modulus 97 for base 10 numbers
  if (!mod97base10Validate(value, 0)) {
    if (debug) {
      console.log("Invalid checksum");
    }
    return false;
  }

  return true;
}

// Main validation function for ICE9 (9 digits)
function validate_ma_ice9(input, debug=false) {
  // Basic input cleanup and validation
  const value = input.replace(/\s/g, '');
  if (!value) {
    if (debug) {
      console.log("Input is empty after cleanup");
    }
    return false;
  }
  if (value.length !== 9) {
    if (debug) {
      console.log("Invalid length");
    }
    return false;
  }
  if (!/^\d+$/.test(value)) {
    if (debug) {
      console.log("Invalid format: Non-digit character detected");
    }
    return false;
  }

  // No checksum validation is performed for ICE9
  return true;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {validate_ma_ice, validate_ma_ice9};
} else {
  window.validate_ma_ice = validate_ma_ice;
  window.validate_ma_ice9 = validate_ma_ice9;
}
