import jsonpack from 'jsonpack';

import compressedData from './data.compressed';
const data = jsonpack.unpack(compressedData);

// const data = require('./minify.data.json');

async function validateTaxId(countryCode, taxId, onlineCheckRequired = false, debug = true) {
    const countryData = data.find(item => item.ISOCountryCode === countryCode.toUpperCase());

    if (!countryData) {
        if (debug) {
            console.log('No entries found for country');
        }
        return 'Country code not found';
    }
    let regexValid = false;
    let checkSumCheckPresent = false;
    let checkSumValid = false;
    let onnlineCheckPresent = false;
    let onlineCheckResult = false;
    let countryModule;

    for (let entry of countryData.data) {
        let regex = new RegExp(entry.regex);
        if (regex.test(taxId)) {
            if (debug) { 
                console.log('Entity Type', entry.type);
            }
            regexValid = true;
            if (debug) {
                console.log('Regex Match:', true);
                console.log('Checksum Validation Required:', entry.checksum);
            }
            
            checkSumCheckPresent = entry.checksum;
            onnlineCheckPresent = entry.online;
            if(checkSumCheckPresent || onlineCheckRequired)
    {
        try {
            if (debug) {
                console.log('looking for', countryCode.toUpperCase(),'.js')
            }
            countryModule = require(`./validators/${countryCode.toUpperCase()}.js`);
        } catch (err) {
            if (debug) {
                console.error('Error loading validator module', err);
            }
        }
    }

            if (checkSumCheckPresent && countryModule) {
                try {
                    const checksumFunctionName = `validate_${entry.type}`;
                    if (typeof countryModule[checksumFunctionName] === "function") {
                        checkSumValid = countryModule[checksumFunctionName](taxId);
                        if (debug) {
                            console.log('Checksum Validation Result:', checkSumValid);
                        }
                    } else {
                        if (debug) {
                            console.error('Checksum function not found');
                        }
                    }
                } catch (err) {
                    if (debug) {
                        console.error('Error in checksum validation', err);
                    }
                }
            }
            if (onlineCheckRequired && countryModule) {
                try {
                    onlineCheckResult = await countryModule['online_check'](taxId,true);
                    if (debug) {
                        console.log('Online Check Result:', onlineCheckResult);
                    }
                } catch (err) {
                    if (debug) {
                        console.error('Error in online check', err);
                    }
                }
            }
            break;
        }
    }

    let isValid = false;
    if (onlineCheckRequired) {
        isValid = regexValid && checkSumValid && onlineCheckResult;
    } else if (checkSumCheckPresent) {
        isValid = regexValid && checkSumValid;
    } else {
        isValid = regexValid;
    }

    return {
        isValid: isValid,
        regexValid: regexValid,
        checkSumCheckPresent: checkSumCheckPresent,
        checkSum: checkSumValid,
        onnlineCheckPresent: onnlineCheckPresent,
        onlineCheck: onlineCheckResult
    };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = validateTaxId; // Assuming "validateTaxId" is the main function you want to export
} else {
    window.validateTaxId = validateTaxId;
}
