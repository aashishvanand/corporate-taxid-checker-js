
// RomanianValidators.js
const century = {
  '0': '19', // shouldn't happen,
  '1': '19',
  '2': '19',
  '3': '18',
  '4': '18',
  '5': '20',
  '6': '20',
  '7': '19',
  '8': '19',
  '9': '19',
};

const COUNTIES = {
  '01': 'Alba',
  '02': 'Arad',
  '03': 'Arges',
  '04': 'Bacau',
  '05': 'Bihor',
  '06': 'Bistrita-Nasaud',
  '07': 'Botosani',
  '08': 'Brasov',
  '09': 'Braila',
  '10': 'Buzau',
  '11': 'Caras-Severin',
  '12': 'Cluj',
  '13': 'Constanta',
  '14': 'Covasna',
  '15': 'Dambovita',
  '16': 'Dolj',
  '17': 'Galati',
  '18': 'Gorj',
  '19': 'Harghita',
  '20': 'Hunedoara',
  '21': 'Ialomita',
  '22': 'Iasi',
  '23': 'Ilfov',
  '24': 'Maramures',
  '25': 'Mehedinti',
  '26': 'Mures',
  '27': 'Neamt',
  '28': 'Olt',
  '29': 'Prahova',
  '30': 'Satu Mare',
  '31': 'Salaj',
  '32': 'Sibiu',
  '33': 'Suceava',
  '34': 'Teleorman',
  '35': 'Timis',
  '36': 'Tulcea',
  '37': 'Vaslui',
  '38': 'Valcea',
  '39': 'Vrancea',
  '40': 'Bucuresti',
  '41': 'Bucuresti - Sector 1',
  '42': 'Bucuresti - Sector 2',
  '43': 'Bucuresti - Sector 3',
  '44': 'Bucuresti - Sector 4',
  '45': 'Bucuresti - Sector 5',
  '46': 'Bucuresti - Sector 6',
  '47': 'Bucuresti - Sector 7 (desfiintat)',
  '48': 'Bucuresti - Sector 8 (desfiintat)',
  '51': 'Calarasi',
  '52': 'Giurgiu',
};

function isValidDate(yy, mm, dd) {
  // Attempt to construct a date using the provided components
  const date = new Date(`${yy}-${mm}-${dd}`);

  // Check if the date is "Invalid Date"
  if (isNaN(date)) {
    return false;
  }

  // Validate that the constructed date matches the provided components
  // This guards against cases like February 30
  return date.getFullYear() == yy && date.getMonth() + 1 == mm && date.getDate() == dd;
}

const VALID_COUNTIES = Object.keys(COUNTIES);

// Helper functions for validation
function weightedSum(number, weights) {
  let sum = 0;
  for (let i = 0; i < number.length; i++) {
    sum += parseInt(number[i], 10) * weights[i];
  }
  return sum;
}

// validate_ro_cnp function
function validate_ro_cnp(input, debug=false) {
  const value = input.replace(/\s+/g, '');

  if (value.length !== 13 || !/^\d+$/.test(value)) {
    if (debug) { console.log("Invalid format or length"); }
      return false;
  }

  // Extract components from the CNP
  const centuryCode = value[0];
  const year = century[centuryCode] + value.substr(1, 2);
  const month = value.substr(3, 2);
  const day = value.substr(5, 2);
  const countyCode = value.substr(7, 2);

// Validate date of birth using isValidDate
  if (!isValidDate(year, month, day)) {
      if (debug) { console.log("Invalid date of birth"); }
      return false;
  }

// Validate county code
  if (!VALID_COUNTIES.includes(countyCode)) {
      if (debug) { console.log("Invalid county code"); }
      return false;
  }

  const weights = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9];
  const checksum = value[value.length - 1];
  const calculatedSum = weightedSum(value.substring(0, value.length - 1), weights);

  if ((calculatedSum % 11 === 10 ? '1' : String(calculatedSum % 11)) !== checksum) {
    if (debug) { console.log("Invalid checksum"); }
      return false;
  }

  return true;
}

// validate_ro_cui function
function validate_ro_cui(input, debug=false) {
  let value = input.replace(/\s+/g, '');

  if (value.length < 2 || value.length > 10 || !/^[1-9]\d*$/.test(value)) {
    if (debug) { console.log("Invalid format or length"); }
      return false;
  }

  value = value.padStart(9, '0');
  const weights = [7, 5, 3, 2, 1, 7, 5, 3, 2];
  const checksum = value[value.length - 1];
  const calculatedSum = weightedSum(value.substring(0, value.length - 1), weights) * 10;

  if (String(calculatedSum % 10) !== checksum) {
    if (debug) { console.log("Invalid checksum"); }
      return false;
  }

  return true;
}

async function online_check(tin,debug=false) {
  const axios = require('axios');
  
  // Extract the relevant portion of the TIN (excluding the msCode)
  const processedTin = tin.substring(2);
  
  try {
      const response = await axios.post('https://ec.europa.eu/taxation_customs/tin/rest-api/tinRequest', {
          msCode: 'RO',
          tinNumber: processedTin
      });

      if (response.status !== 200) {
          if (debug) console.log(`Request failed with status: ${response.status}`);
          return false;
      }

      const data = response.data;
      if (data.result.structureValid === true && data.result.syntaxValid === true) {
          return true;
      }

      if (data.result.userError !== "0" || data.result.error === true || data.result.structureValid === false || data.result.syntaxValid === false) {
          if (debug) {
              console.log('Response Data:', data.result);
              if (data.result.userError !== "0") console.log(`User Error with code: ${data.result.userError}`);
              if (data.result.error === true) console.log('Error flag set to true in response');
              if (data.result.structureValid === false) console.log('Structure validity check failed');
              if (data.result.syntaxValid === false) console.log('Syntax validity check failed');
          }
          return false;
      }
  } catch (error) {
      if (debug) console.log('Axios request error:', error);
      console.error(error);
      return false;
  }
}

function validate_ro_cif(input, debug=false) {
    if (input.length === 13) {
        // apparently a CNP can also be used (however, not all sources agree)
        return validate_ro_cnp(input,debug);
    }
    if (input.length >= 2 && input.length <= 10) {
        return validate_ro_cui(input,debug);
    }
    if (debug) { console.log("Invalid Length"); }
    return false
}


module.exports = { validate_ro_cif, online_check };