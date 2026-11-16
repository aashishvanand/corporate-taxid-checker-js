// ICE: the last two digits are chosen so the full 15-digit number is divisible by 97.
// Computed digit by digit to avoid relying on floating-point precision.
function mod97Validate(number: string): boolean {
  let remainder = 0;
  for (const ch of number) {
    remainder = (remainder * 10 + parseInt(ch, 10)) % 97;
  }
  return remainder === 0;
}
// Main validation function for ICE (15 digits)
function validate_ma_ice(input: string, debug: boolean = false): boolean {
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
  if (!mod97Validate(value)) {
    if (debug) {
      console.log("Invalid checksum");
    }
    return false;
  }

  return true;
}

// Main validation function for ICE9 (9 digits)
function validate_ma_ice9(input: string, debug: boolean = false): boolean {
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

export { validate_ma_ice, validate_ma_ice9 };
