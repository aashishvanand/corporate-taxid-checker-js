
function validate_bz_tin(tin, debug=false) {
    const code = tin.slice(6);

    if (code && !['10', '13', '66'].includes(code)) {
        if (debug) { 
            console.log("Invalid component");
        }
        return false;
    }

    return true;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {validate_bz_tin};
} else {
    window.validate_bz_tin = validate_bz_tin;
}