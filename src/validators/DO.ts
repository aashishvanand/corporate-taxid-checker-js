import { weightedSum } from '../utils';

function validate_do_rnc(input: string, debug: boolean = false): boolean {
    // Strip dashes and spaces
    const rnc = input.replace(/[-\s]/g, '');

    if (!/^\d+$/.test(rnc)) {
        if (debug) { console.log("Invalid format"); }
        return false;
    }

    // 11-digit cédula: no checksum enforced (python-stdnum keeps a list of issued
    // cédulas that fail Luhn, so a strict check would reject real IDs)
    if (rnc.length === 11) {
        return true;
    }

    if (rnc.length !== 9) {
        if (debug) { console.log("Invalid length"); }
        return false;
    }

    const front = rnc.slice(0, 8);
    const check = rnc.slice(-1);

    const sum = weightedSum(front, {
        weights: [7, 9, 8, 6, 5, 4, 3, 2],
        modulus: 11,
    });

    if (String(((10 - sum) % 9) + 1) !== check) {
        if (debug) { 
            console.log("Invalid checksum");
        }
        return false;
    }

    return true;
}

export { validate_do_rnc };
