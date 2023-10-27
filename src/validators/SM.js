// All small valued registered entities
const lowNumbers = new Set([
  2, 4, 6, 7, 8, 9, 10, 11, 13, 16, 18, 19, 20, 21, 25, 26, 30, 32, 33, 35, 36,
  37, 38, 39, 40, 42, 45, 47, 49, 51, 52, 55, 56, 57, 58, 59, 61, 62, 64, 65,
  66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 79, 80, 81, 84, 85, 87, 88, 91,
  92, 94, 95, 96, 97, 99,
]);

function validate_sm_coe(input, debug=false) {
    // Assuming clean function removes any hyphens, white spaces and converts letters to uppercase
    const value = input.replace(/[-\s]/g, '').toUpperCase();

    if (value.length > 5 || value.length === 0) {
        if (debug) { console.log("Invalid length"); }
      return false;
    }
    if (!/^\d+$/.test(value)) {
        if (debug) { console.log("Invalid format"); }
      return false;
    }

    if (value.length < 3 && !lowNumbers.has(parseInt(value, 10))) {
        if (debug) { console.log("Invalid component"); }
      return false;
    }

    return true;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {validate_sm_coe};
} else {
  window.validate_sm_coe = validate_sm_coe;
}