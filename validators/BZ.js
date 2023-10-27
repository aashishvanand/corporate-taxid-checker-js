
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

module.exports = { validate_bz_tin };
