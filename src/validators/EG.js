
function validate_eg_tn(tn, debug=false) {

    // Mapping of Arabic to Western digits
    const ARABIC_NUMBERS_MAP = {
        '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4', 
        '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
        '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4', 
        '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
    };

    // Replace any Arabic digits with Western digits
    let normalizedTn = '';
    for (const char of tn) {
        normalizedTn += ARABIC_NUMBERS_MAP[char] || char;
    }

    // Assuming tn is already cleaned and in the correct format
    // and that the length check has been done outside this function

    if (!/^\d+$/.test(normalizedTn)) { // Checking if the input is all digits
        if (debug) { 
            console.log("Invalid format");
        }
        return false;
    }

    // If the Tax Number passes all checks
    return true;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {validate_eg_tn};
  } else {
    window.validate_eg_tn = validate_eg_tn;
  }
