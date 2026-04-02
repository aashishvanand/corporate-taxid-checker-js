import { weightedSum } from '../utils';

function validate_do_rnc(input: string, debug: boolean = false): boolean {
    // Strip dashes and spaces
    const rnc = input.replace(/[-\s]/g, '');

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
