
function validate_ad_nrt(nrt, debug=false) {
    // Check for correct length
    if (nrt.length !== 8) {
        if (debug) { console.log("Invalid length"); }
        return false;
    }

    const firstChar = nrt[0];
    const lastChar = nrt[nrt.length - 1];
    const mid = nrt.substring(1, nrt.length - 1);

    // Check if the first and last characters are alphabets
    if (!firstChar.match(/[A-Z]/i) || !lastChar.match(/[A-Z]/i)) {
        if (debug) { console.log("Invalid format: first or last character is not an alphabet"); }
        return false;
    }

    // Check if the middle section is all digits
    if (!mid.match(/^\d+$/)) {
        if (debug) { console.log("Invalid format: middle characters are not all digits"); }
        return false;
    }

    // Check specific rules for first character
    if (!'ACDEFGLOPU'.includes(firstChar)) {
        if (debug) { console.log("Invalid component: first character is not one of the allowed characters"); }
        return false;
    }

    // Convert mid to a number for the next checks
    const midNum = parseInt(mid, 10);

    if (firstChar === 'F' && midNum > 699999) {
        if (debug) { console.log("Invalid component: numbers too high for 'F' category"); }
        return false;
    }

    if ('AL'.includes(firstChar) && midNum > 699999 && midNum < 800000) {
        if (debug) { console.log("Invalid component: numbers for 'A' and 'L' categories are in an invalid range"); }
        return false;
    }

    // If all checks pass, return valid
    return true;
}

module.exports = { validate_ad_nrt };
