// Utility functions and variables
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

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

// Dummy siren.validate, replace with the actual implementation
function sirenValidate(number) {
  // Placeholder for actual validation logic
  return true;
}
debug = false
// French VAT number validation
function frValidate(input) {
  const [value, error] = clean(input);

  if (error) {
    if (debug) { console.log(error); }
    return false;
  }
  if (value.length !== 11) {
    if (debug) { console.log("Invalid length"); }
    return false;
  }

  const [check, back] = [value.slice(0, 2), value.slice(2)];

  if (!alphabet.includes(check[0]) || !alphabet.includes(check[1])) {
    if (debug) { console.log("Invalid format"); }
    return false;
  }
  if (!isDigits(back)) {
    if (debug) { console.log("Invalid format: non-digit characters present"); }
    return false;
  }

  // This part is specific to French and Monaco VAT numbers, might not be applicable in all cases
  if (value.substring(2, 5) !== '000') {
    const r = sirenValidate(value.substr(2));
    if (!r.isValid) {
      if (debug) { console.log("SIREN validation failed"); }
      return false;
    }
  }

  // Add further checksum validation here if needed

  return true;
}
debug = false
// Moroccan VAT number validation
function validate_ma_tva(input, debug=false) {
  const result = frValidate(input, debug);

  if (!result.isValid) {
    return false;
  }

  if (input.substr(2, 3) !== '000') {
    if (debug) { console.log("Invalid component: Expected '000' at positions 3-5"); }
    return false;
  }

  return true;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {validate_ma_tva};
} else {
  window.validate_ma_tva = validate_ma_tva;
}
