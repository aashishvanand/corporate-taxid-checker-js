
function weightedSum(input, config) {
  const { weights, modulus } = config;
  let sum = 0;
  for (let i = 0; i < input.length; i++) {
    sum += parseInt(input[i], 10) * weights[i];
  }
  return sum % modulus;
}
function validate_pe_ruc(ruc, debug=false) {
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
  if (value.length !== 11) {
    if (debug) { console.log("Invalid length"); }
    return false;
  }

  // Validate input format
  if (!/^\d{11}$/.test(value)) {
    if (debug) { console.log("Invalid format"); }
    return false;
  }

  // Validate input components
  if (!['10', '15', '16', '17', '20'].includes(value.substr(0, 2))) {
    if (debug) { console.log("Invalid component"); }
    return false;
  }

  const [front, check] = [value.slice(0, 10), value.slice(-1)];

  // Calculate the weighted sum
  const sum = weightedSum(front, {
    weights: [5, 4, 3, 2, 7, 6, 5, 4, 3, 2],
    modulus: 11,
  });

  // Validate checksum
  if (String((11 - sum) % 10) !== check) {
    if (debug) { console.log("Invalid checksum"); }
    return false;
  }

  return true;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {validate_pe_ruc};
} else {
  window.validate_pe_ruc = validate_pe_ruc;
}
