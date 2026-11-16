import { validate_fr_vat } from './FR';

// Monaco uses the French VAT scheme; Monegasque SIRENs start with 000
function validate_mc_vat(input: string, debug: boolean = false): boolean {
    const value = input.replace(/\s/g, '').toUpperCase();
    const numPart = value.startsWith('FR') ? value.substring(2) : value;

    if (!/^\d{2}000\d{6}$/.test(numPart)) {
        if (debug) { console.log("Invalid format: Monaco VAT is FR + 2 digits + 000 + 6 digits"); }
        return false;
    }

    return validate_fr_vat(value, debug);
}

export { validate_mc_vat };
