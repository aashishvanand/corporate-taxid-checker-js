const fs = require('fs');
let data;
try {
    const jsonData = fs.readFileSync('./data.json');
    data = JSON.parse(jsonData);
} catch (err) {
    console.error('Error loading data', err);
    process.exit(1);
}

async function validateTaxId(countryCode, taxId, onlineCheckRequired = false, debug = true) {
    const countryData = data.find(item => item.ISOCountryCode === countryCode.toUpperCase());

    if (!countryData) {
        if (debug) {
            console.log('No entries found for country');
        }
        return 'Country code not found';
    }
    let regexValid = false;
    let checkSumRequired = false;
    let checkSumValid = false;
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
            
            checkSumRequired = entry.checksum;
            if(checkSumRequired || onlineCheckRequired)
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

            if (checkSumRequired && countryModule) {
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
    } else if (checkSumRequired) {
        isValid = regexValid && checkSumValid;
    } else {
        isValid = regexValid;
    }

    return {
        isValid: isValid,
        regexValid: regexValid,
        checkSum: checkSumValid,
        onlineCheck: onlineCheckResult
    };
}

module.exports = validateTaxId;
