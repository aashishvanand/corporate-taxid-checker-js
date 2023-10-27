
const nameBlacklist = new Set([
  'BUEI',
  'BUEY',
  'CACA',
  'CACO',
  'CAGA',
  'CAGO',
  'CAKA',
  'CAKO',
  'COGE',
  'COJA',
  'COJE',
  'COJI',
  'COJO',
  'CULO',
  'FETO',
  'GUEY',
  'JOTO',
  'KACA',
  'KACO',
  'KAGA',
  'KAGO',
  'KAKA',
  'KOGE',
  'KOJO',
  'KULO',
  'MAME',
  'MAMO',
  'MEAR',
  'MEAS',
  'MEON',
  'MION',
  'MOCO',
  'MULA',
  'PEDA',
  'PEDO',
  'PENE',
  'PUTA',
  'PUTO',
  'QULO',
  'RATA',
  'RUIN',
]);

const checkAlphabet = '0123456789ABCDEFGHIJKLMN&OPQRSTUVWXYZ Ñ';

function clean(input) {
  if (typeof input !== 'string') {
    return ['', 'Input must be a string'];
  }
  const value = input.toUpperCase().replace(/\s/g, '');
  if (!value) {
    return ['', 'Input is empty after cleanup'];
  }
  return [value, null];
}

function isValidDateCompactYYMMDD(dateString, strict = false) {
  // Implement this function based on your specific requirements for date validation
  // This is a placeholder and needs a proper implementation
  return true;
}

function weightedSum(input, config) {
  const {
    modulus,
    alphabet,
    weights,
    reverse,
  } = config;
  let sum = 0;
  const characters = reverse ? input.split('').reverse() : input.split('');
  for (let i = 0; i < characters.length; i++) {
    const index = alphabet.indexOf(characters[i]);
    if (index === -1) {
      return null; // or handle error differently, depending on your case
    }
    sum += index * weights[i];
  }
  return sum % modulus;
}
debug = false
function validate_mx_rfc(rfc, debug=false) {
  const [value, error] = clean(rfc);

  if (error) {
    if (debug) { console.log(error); }
    return false;
  }
  if (value.length === 10 || value.length === 13) {
    if (!/^[A-Z&Ñ]{4}[0-9]{6}([0-9A-Z]{3})?$/.test(value)) {
      if (debug) { console.log("Invalid component"); }
      return false;
    }
    if (nameBlacklist.has(value.substr(0, 4))) {
      if (debug) { console.log("Invalid component"); }
      return false;
    }
    if (!isValidDateCompactYYMMDD(value.substr(4, 6), true)) {
      if (debug) { console.log("Invalid component"); }
      return false;
    }
  } else if (value.length === 12) {
    if (!/^[A-Z&Ñ]{3}[0-9]{6}[0-9A-Z]{3}$/.test(value)) {
      if (debug) { console.log("Invalid component"); }
      return false;
    }
    if (!isValidDateCompactYYMMDD(value.substr(3, 6))) {
      if (debug) { console.log("Invalid component"); }
      return false;
    }
  } else {
    if (debug) { console.log("Invalid length"); }
    return false;
  }

  if (value.length >= 12) {
    if (!/[1-9A-V][1-9A-Z][0-9A]$/.test(value)) {
      if (debug) { console.log("Invalid component"); }
      return false;
    }

    const [front, check] = [value.substring(0, value.length - 1), value.charAt(value.length - 1)];

    const sum = weightedSum(front.padStart(12, ' '), {
      modulus: 11,
      alphabet: checkAlphabet,
      weights: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
      reverse: true,
    });

    const mod = 11 - sum;
    let val;
    if (mod === 11) {
      val = '0';
    } else if (mod === 10) {
      val = 'A';
    } else {
      val = String(mod);
    }

    if (check !== val) {
      if (debug) { console.log("Invalid checksum"); }
      return false;
    }
  }

  return true;
}


if (typeof module !== 'undefined' && module.exports) {
  module.exports = {validate_mx_rfc};
} else {
  window.validate_mx_rfc = validate_mx_rfc;
}

