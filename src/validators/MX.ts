import { clean } from '../utils';

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

function isValidDateCompactYYMMDD(dateString: string, strict: boolean = false): boolean {
  if (!/^\d{6}$/.test(dateString)) return false;

  const yy = parseInt(dateString.substring(0, 2), 10);
  const mm = parseInt(dateString.substring(2, 4), 10);
  const dd = parseInt(dateString.substring(4, 6), 10);
  if (mm < 1 || mm > 12 || dd < 1) return false;

  // Day 0 of the next month is the last day of this one.
  const daysInMonth = (year: number) => new Date(Date.UTC(year, mm, 0)).getUTCDate();
  // A two-digit year is ambiguous. Accept it in either century: the two readings differ
  // only for 29 February (e.g. 00-02-29 is valid in 2000 but not in 1900).
  const candidates = [1900 + yy, 2000 + yy];
  const valid = candidates.some((year) => dd <= daysInMonth(year));
  if (!valid) return false;

  // Strict mode: the RFC date cannot be in the future.
  if (strict) {
    const now = Date.now();
    return candidates.some((year) => Date.UTC(year, mm - 1, dd) <= now);
  }
  return true;
}

function weightedSum(input: string, config: { modulus: number; alphabet: string; weights: number[]; reverse?: boolean }): number | null {
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
function validate_mx_rfc(rfc: string, debug: boolean = false): boolean {
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

    const mod = 11 - (sum ?? 0);
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

export { validate_mx_rfc };
