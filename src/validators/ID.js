
function luhnChecksumValidate(number) {
  let sum = 0;
  let alternate = false;
  for (let i = number.length - 1; i >= 0; i--) {
    let n = parseInt(number.charAt(i), 10);
    if (alternate) {
      n *= 2;
      if (n > 9) {
        n = (n % 10) + 1;
      }
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}

function validate_id_npwp(input, debug=false) {
  const NPWP_TAX_IDENTITIES = [
    '01', '02', '21', '31', '00', '20', '04', '05', '06', '07', '08', '09',
    '24', '25', '26', '31', '34', '35', '36', '47', '48', '49', '57', '58',
    '67', '77', '78', '79', '87', '88', '89', '97',
  ];

  const value = input;

  if (value.length !== 15) {
    if (debug) { console.log("Invalid Length"); }
      return false;
  }

  if (!/^\d+$/.test(value)) {
    if (debug) { console.log("Invalid Format"); }
    return false;
  }

  if (!NPWP_TAX_IDENTITIES.includes(value.substr(0, 2))) {
    if (debug) { console.log("Invalid Component"); }
    return false
  }

  if (!luhnChecksumValidate(value.substr(0, 9))) {
    if (debug) { console.log("Invalid Checksum"); }
      return false;
  }

  return true;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {validate_id_npwp};
} else {
  window.validate_id_npwp = validate_id_npwp;
}
