global.self = global;
const validateTaxId = require('corporate-taxid-checker-js');

async function validateTaxDetails(countryCode, taxId, performOnlineCheck = false) {
    try {
        const validationResult = await validateTaxId(countryCode, taxId, performOnlineCheck);

        if (validationResult.isValid) {
            console.log(`The Tax ID ${taxId} from ${countryCode} is valid.`);
        } else {
            console.log(`The Tax ID ${taxId} from ${countryCode} is invalid. Reason: ${validationResult.reason}`);
        }
    } catch (error) {
        console.error('Error validating Tax ID:', error.message);
    }
}

// Example usage
validateTaxDetails('SG', '202018854C', false);