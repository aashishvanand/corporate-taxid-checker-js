const validateTaxId = require('./index'); // Adjust the path if your file is located elsewhere

function testValidation(countryCode, taxId) {
    console.log(`Testing ${taxId} from ${countryCode}`);
    const result = validateTaxId(countryCode, taxId);
    console.log(`Result: ${result}`);
}

// Replace with your test cases
// testValidation('IN', '21WEKSQ0384LZE');
// testValidation('IN', '36AAGCG6803L1ZD');
testValidation('SG','202018854C');

// testValidation('ZA', '4123456789');
