
const VALID_CONTROL_KEYS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 
  'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'
];
const VALID_TVA_CODES = ['A', 'P', 'B', 'D', 'N'];
const VALID_CATEGORY_CODES = ['M', 'P', 'C', 'N', 'E'];

function validate_tn_mf(input, debug=false) {
    // Assuming compactImpl function removes any non-alphanumeric characters
    // and converts letters to uppercase
    const value = input.replace(/[^\w]/g, '').toUpperCase();

    if (value.length !== 8 && value.length !== 13) {
        if (debug) { console.log("Invalid length"); }
      return false;
    }

    const front = value.substring(0, 7);
    const key = value[7];
    const tva = value.length > 8 ? value[8] : undefined;
    const category = value.length > 9 ? value[9] : undefined;
    const rest = value.length > 10 ? value.substring(10) : undefined;

    if (!/^\d+$/.test(front)) {
        if (debug) { console.log("Invalid format"); }
      return false;
    }
    if (!VALID_CONTROL_KEYS.includes(key)) {
        if (debug) { console.log("Invalid component"); }
      return false;
    }
    if (value.length === 13) {
        if (!VALID_TVA_CODES.includes(tva)) {
            if (debug) { console.log("Invalid component"); }
      return false;
        }
        if (!VALID_CATEGORY_CODES.includes(category)) {
            if (debug) { console.log("Invalid component"); }
      return false;
        }
        if (!/^\d+$/.test(rest)) {
            if (debug) { console.log("Invalid component"); }
      return false;
        }
        if (rest !== '000' && category !== 'E') {
            if (debug) { console.log("Invalid component"); }
      return false;
        }
    }

    return true;
}
module.exports = { validate_tn_mf };
