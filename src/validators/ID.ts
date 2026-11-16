import { luhnChecksumValidate } from '../utils';

const NPWP_TAX_IDENTITIES = [
  '01', '02', '21', '31', '00', '20', '04', '05', '06', '07', '08', '09',
  '24', '25', '26', '34', '35', '36', '47', '48', '49', '57', '58',
  '67', '77', '78', '79', '87', '88', '89', '97',
];

// Legacy 15-digit NPWP: 2-digit taxpayer type, 6-digit serial + Luhn check digit
// over the first 9 digits, then 3-digit tax office and 3-digit branch code.
function validateLegacyNpwp(value: string, debug: boolean): boolean {
  if (!NPWP_TAX_IDENTITIES.includes(value.substring(0, 2))) {
    if (debug) { console.log("Invalid Component"); }
    return false;
  }

  if (!luhnChecksumValidate(value.substring(0, 9))) {
    if (debug) { console.log("Invalid Checksum"); }
    return false;
  }

  return true;
}

// NIK (Nomor Induk Kependudukan), used as the 16-digit NPWP for resident
// individuals since 2024: PPRRDD + DDMMYY (day + 40 for women) + 4-digit serial.
// There is no check digit, so only the structure can be verified.
function validateNik(value: string, debug: boolean): boolean {
  const province = Number(value.substring(0, 2));
  let day = Number(value.substring(6, 8));
  const month = Number(value.substring(8, 10));
  const serial = value.substring(12);

  if (day > 40) day -= 40;

  if (province < 11 || province > 96 || day < 1 || day > 31 || month < 1 || month > 12 || serial === '0000') {
    if (debug) { console.log("Invalid NIK structure"); }
    return false;
  }

  return true;
}

function validate_id_npwp(input: string, debug: boolean = false): boolean {
  // The regex allows the dotted/dashed format ("XX.XXX.XXX.X-XXX.XXX");
  // strip the separators before checking the digit payload/checksum.
  const value = input.replace(/[.\-]/g, '');

  if (!/^\d+$/.test(value)) {
    if (debug) { console.log("Invalid Format"); }
    return false;
  }

  if (value.length === 15) {
    return validateLegacyNpwp(value, debug);
  }

  if (value.length === 16) {
    // Non-individual taxpayers got a 16-digit NPWP by prefixing "0" to the legacy number
    return value[0] === '0'
      ? validateLegacyNpwp(value.substring(1), debug)
      : validateNik(value, debug);
  }

  if (debug) { console.log("Invalid Length"); }
  return false;
}

export { validate_id_npwp };
