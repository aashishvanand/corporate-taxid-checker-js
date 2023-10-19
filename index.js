const fs = require('fs');
var debug = true;
let data;
try {
    const jsonData = fs.readFileSync('./data.json');
    data = JSON.parse(jsonData);
} catch (err) {
    if (debug) {
    console.error('Error loading data', err);
    }
    process.exit(1);
}

function validateTaxId(countryCode, taxId) {
    const countryData = data.find(item => item.ISOCountryCode === countryCode.toUpperCase());

    if (!countryData) {
        if (debug) {
        console.log('No entries found for country');
        }
        return 'Country code not found';
    }

    let isValid = false;

    for (let entry of countryData.data) {
        if (debug) {
        console.log(entry)
        }
        let regex = new RegExp(entry.regex);
        if (regex.test(taxId)) {
            if (debug) {
            console.log('Entity Type', entry.type)
            }
            isValid = true;
            if (debug) {
            console.log('Regex Match:',isValid);
            console.log('Checksum Validation Required:', entry.checksum);
            }
            if (entry.checksum) {
                try {
                    const checksumFunctionName = `validate_${entry.type}`;
                    const checksumModule = require(`./validators/${countryCode.toUpperCase()}.js`);
                    if (typeof checksumModule[checksumFunctionName] === "function") {
                        isValid = checksumModule[checksumFunctionName](taxId);
                        if (debug) {
                        console.log('Checksum Validation Result:', isValid);
                        }
                    } else {
                        if (debug) {
                        console.error('Checksum function not found');
                        }
                        isValid = false; // or handle this case as you see fit
                    }
                } catch (err) {
                    if (debug) {
                    console.error('Error in checksum validation', err);
                    }
                    isValid = false; // or handle this case as you see fit
                }
            }
            break; // exit the loop once a valid entry is found
        }
    }

    return isValid ? true : false;
}

module.exports = validateTaxId;
