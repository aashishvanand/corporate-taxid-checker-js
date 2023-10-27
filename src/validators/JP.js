// Utility function to perform weighted sum
function weightedSum(number, config) {
  const { modulus, reverse, weights } = config;
  let sum = 0;
  const digits = number.split('').map(num => parseInt(num, 10));
  const sequence = reverse ? [...digits].reverse() : digits;

  for (let i = 0; i < sequence.length; i++) {
    sum += sequence[i] * (weights[i % weights.length]);
  }

  return modulus ? sum % modulus : sum;
}
// Main validation function
function validate_jp_cn(input, debug=false) {
  // Basic input cleanup and validation
  const value = input.replace(/\s/g, '');
  if (!value) {
    if (debug) {
      console.log("Input is empty after cleanup");
    }
    return false;
  }
  if (value.length !== 13) {
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

  // Extract check digit and the rest of the number
  const check = value.slice(0, 1);
  const rest = value.slice(1);

  // Calculate checksum
  const sum = weightedSum(rest, {
    modulus: 9,
    reverse: true,
    weights: [2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1],
  });

  // Validate checksum
  if (String((9 - sum) % 9) !== check) {
    if (debug) {
      console.log("Invalid checksum");
    }
    return false;
  }

  return true;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {validate_jp_cn};
} else {
  window.validate_jp_cn = validate_jp_cn;
}
