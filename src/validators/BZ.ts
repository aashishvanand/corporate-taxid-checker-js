
function validate_bz_vat(tin: string, debug: boolean = false): boolean {
    const code = tin.slice(6);

    if (code && !['10', '13', '66'].includes(code)) {
        if (debug) { 
            console.log("Invalid component");
        }
        return false;
    }

    return true;
}

export { validate_bz_vat };
