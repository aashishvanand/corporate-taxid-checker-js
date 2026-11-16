
const ALPHABET = 'WABCDEFGHIJKLMNOPQRSTUV';
  
function calcCheckDigit(valueIn: string): string {
  const value = valueIn.padStart(7, '0');
  const d1 = value
    .substr(0, 7)
    .split('')
    .reduce((acc: number, vv: string, idx: number) => {
      const v = Number.parseInt(vv, 10);

      return acc + (8 - idx) * v;
    }, 0);

  const d2 = value.length === 8 ? 9 * ALPHABET.indexOf(value[7]) : 0;

  return ALPHABET[(d1 + d2) % 23];
}

function validate_ie_vat(input: string, debug: boolean = false): boolean {
  const value = input;

  if (value.length !== 8 && value.length !== 9) {
    if (debug) { console.log("Invalid Length"); }
      return false;
  }

  if (!/^\d/.test(value[0]) || !/^\d{5}$/.test(value.substr(2, 5))) {
    if (debug) { console.log("Invalid Format"); }
    return false;
  }

  const front = value.substr(0, 7);
  const end = value.substr(7);

  if (![...end].every(v => ALPHABET.includes(v))) {
    if (debug) { console.log("Invalid Format"); }
    return false;
  }

  if (/^\d+$/.test(front)) {
    // 7 digits followed by 1 or 2 letters
    if (value[7] !== calcCheckDigit(`${front}${value.substr(8)}`)) {
      if (debug) { console.log("Invalid Checksum"); }
      return false;
    }
  } else if ('ABCDEFGHIJKLMNOPQRSTUVWXYZ+*'.includes(value[1])) {
    // old system, second character is a letter
    if (value[7] !== calcCheckDigit(`${value.substr(2, 5)}${value[0]}`)) {
      if (debug) { console.log("Invalid Checksum"); }
      return false;
    }
  } else {
    if (debug) { console.log("Invalid Format"); }
    return false;
  }

  return true;
}

export { validate_ie_vat };
