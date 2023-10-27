
function weightedSum(input, config) {
  const { weights, modulus } = config;
  let sum = 0;
  for (let i = 0; i < input.length; i++) {
    sum += parseInt(input[i], 10) * weights[i];
  }
  return sum % modulus;
}

function validate_nz_ird(ird, debug=false) {
  // Validate input type
  if (typeof ird !== 'string') {
    if (debug) { console.log("Input must be a string"); }
    return false;
  }
  
  // Clean the input
  const value = ird.replace(/\s+/g, '');

  // Check for empty input post-cleanup
  if (!value) {
    if (debug) { console.log("Input is empty after cleanup"); }
    return false;
  }

  // Validate input length
  if (value.length !== 8 && value.length !== 9) {
    if (debug) { console.log("Invalid length"); }
    return false;
  }

  // Validate input format
  if (!/^\d{8,9}$/.test(value)) {
    if (debug) { console.log("Invalid format"); }
    return false;
  }

  const [frontV, check] = [value.slice(0, -1), value.slice(-1)];
  const front = frontV.padStart(8, '0');

  // Calculate the weighted sum for the first set of weights
  let sum = weightedSum(front, {
    weights: [3, 2, 7, 6, 5, 4, 3, 2],
    modulus: 11,
  });

  // Base the new sum on the result from the first calculation
  if (11 - sum === 10) {
    sum = weightedSum(front, {
      weights: [7, 4, 3, 2, 5, 2, 7, 6],
      modulus: 11,
    });
  } else {
    sum = 11 - sum;
  }

  // Validate checksum
  if (String(sum % 10) !== check) {
    if (debug) { console.log("Invalid checksum"); }
    return false;
  }

  return true;
}

module.exports = { validate_nz_ird };
