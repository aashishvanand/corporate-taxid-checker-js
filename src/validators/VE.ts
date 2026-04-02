import { weightedSum } from '../utils';

const companyTypes = {
  V: 4, // natural person born in Venezuela
  E: 8, // foreign natural person
  J: 12, // company
  P: 16, // passport
  G: 20, // government
};

function validate_ve_rif(input: string, debug: boolean = false): boolean {
    // Assuming a clean function that removes any non-alphanumeric characters
    // and converts letters to uppercase
    const value = input.replace(/[^\w]/g, '').toUpperCase();

    if (value.length !== 10) {
        if (debug) { console.log("Invalid length"); }
      return false;
    }

    if (!/^[VEJPG]\d{9}$/.test(value)) {
        if (debug) { console.log("Invalid format"); }
      return false;
    }

    const ctype = value[0];
    const body = value.substring(1, 9);
    const check = value[9];

    const first = (companyTypes as Record<string, number>)[ctype];
    if (first === undefined) {
        if (debug) { console.log("Invalid component"); }
      return false;
    }

    const weights = [3, 2, 7, 6, 5, 4, 3, 2];
    const sum = weightedSum(body, weights, 11);

    const digit = (first + sum) % 11;

    // Assuming '00987654321' is a predefined string that maps the digit to the correct check character
    if ('00987654321'[digit] !== check) {
        if (debug) { console.log("Invalid checksum"); }
      return false;
    }

    return true;
}

export { validate_ve_rif };
