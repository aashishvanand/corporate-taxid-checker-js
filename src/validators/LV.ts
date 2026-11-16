import { weightedSum } from '../utils';

// Utility to check if the date is valid
function isValidDate(year: string, month: string, day: string, strict: boolean = false): boolean {
  const date = new Date(`${year}-${month}-${day}`);
  if (strict) {
    return (
      date.getFullYear() == Number(year) &&
      date.getMonth() + 1 == Number(month) &&
      date.getDate() == Number(day)
    );
  }
  return date instanceof Date && !isNaN(date.getTime());
}

// Main validation function
function validate_lv_pvn(input: string, debug: boolean = false): boolean {
  // Basic input cleanup and validation
  const value = input.replace(/\s/g, '');
  if (!value) {
    if (debug) {
      console.log("Input is empty after cleanup");
    }
    return false;
  }
  if (value.length !== 11) {
    if (debug) {
      console.log("Invalid length");
    }
    return false;
  }
  if (!/^\d+$/.test(value)) {
    if (debug) {
      console.log("Invalid format: Non-digit character detected");
    }
    return false;
  }

  const isIndividual = '0123'.includes(value[0]);

  if (isIndividual) {
    // Validate birthdate for individuals
    const [dd, mm, yy, century] = [
      value.substr(0, 2),
      value.substr(2, 2),
      value.substr(4, 2),
      value.substr(6, 1),
    ];

    if (!isValidDate(`${18 + parseInt(century, 10)}${yy}`, mm, dd, true)) {
      if (debug) {
        console.log("Invalid date component");
      }
      return false;
    }

    // Validate the checksum for individuals
    const [front, check] = [value.substr(0, value.length - 1), value.substr(value.length - 1)];
    const sum =
      1 +
      weightedSum(front, {
        weights: [10, 5, 8, 4, 2, 1, 6, 3, 7, 9],
        modulus: 11,
      });

    if (String((sum % 11) % 10) !== check) {
      if (debug) {
        console.log("Invalid checksum");
      }
      return false;
    }
  } else {
    // Validate the checksum for non-individuals (legal entities)
    const weights = [9, 1, 4, 8, 3, 10, 2, 5, 7, 6];
    let total = 0;
    for (let i = 0; i < 10; i++) {
      total += parseInt(value[i], 10) * weights[i];
    }

    // Special adjustment for numbers starting with 9
    if (total % 11 === 4 && value[0] === '9') {
      total -= 45;
    }

    const remainder = total % 11;
    let checkDigit: number;
    if (remainder === 4) {
      checkDigit = 4 - total;
    } else if (remainder > 4) {
      checkDigit = 14 - remainder;
    } else {
      checkDigit = 3 - remainder;
    }

    if (checkDigit !== parseInt(value[10], 10)) {
      if (debug) {
        console.log("Invalid checksum");
      }
      return false;
    }
  }

  return true;
}

export { validate_lv_pvn };
