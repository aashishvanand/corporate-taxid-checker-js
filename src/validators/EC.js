
function validate_ec_ruc(ruc, debug=false) {
    // Assuming ruc is already cleaned and in the correct format
    // and that the length check and format check have been done outside this function

    if (!/^\d+$/.test(ruc)) { // Checking if the input is all digits
        if (debug) { 
            console.log("Invalid format");
        }
        return false;
    }

    // Validate province code
    const provinceCode = parseInt(ruc.substring(0, 2), 10);
    if (provinceCode < 1 || provinceCode > 24) {
        if (debug) { 
            console.log("Invalid component: province code");
        }
        return false;
    }

    // Validate third digit and establishment number based on the type of RUC
    const thirdDigit = parseInt(ruc[2], 10);
    const establishmentNumber = ruc.substring(ruc.length - 3);
    
    // Validate for different RUC types
    if (thirdDigit < 6) {
        // Natural RUC
        if (establishmentNumber === '000') {
            if (debug) { 
                console.log("Invalid component: establishment number");
            }
            return false;
        }
        // Additional validation can be added here for natural RUC (e.g., check digit)
    } else if (thirdDigit === 6) {
        // Public RUC
        if (ruc.substring(9, 13) === '0000') {
            if (debug) { 
                console.log("Invalid component: establishment number");
            }
            return false;
        }
        // Additional validation can be added here for public RUC (e.g., check digit)
    } else if (thirdDigit === 9) {
        // Juridical RUC
        if (establishmentNumber === '000') {
            if (debug) { 
                console.log("Invalid component: establishment number");
            }
            return false;
        }
        // Additional validation can be added here for juridical RUC (e.g., check digit)
    } else {
        if (debug) { 
            console.log("Invalid component: third digit");
        }
        return false;
    }

    return true;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {validate_ec_ruc};
  } else {
    window.validate_ec_ruc = validate_ec_ruc;
  }
