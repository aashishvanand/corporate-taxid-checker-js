const validateTaxId = require('../src/index.js');

async function testValidation(countryCode, taxId, onlineCheck = false) {
    console.log(`Testing ${taxId} from ${countryCode}`);
    const result = await validateTaxId(countryCode, taxId, onlineCheck);
    console.log('-----------------------------');
    console.log(`Overall Validity:`, result.isValid);
    console.log(`Regex Valid:`, result.regexValid);
    if (result.checkSumCheckPresent) {
    console.log(`Checksum Valid`, result.checkSum);
    }
    if (result.onnlineCheckPresent) {
    console.log(`Online Check:`, result.onlineCheck);
    }
    console.log('-----------------------------');
}

// Replace with your test cases
// testValidation('IN', '21WEKSQ0384LZE'); //fail
testValidation('IN', '36AAGCG6803L1ZD'); //pass
// testValidation('SG','202018854C'); //pass
// testValidation('ZA', '4123456789'); //checksum fail


//google
// testValidation('SG','200817984R') //pass
// testValidation('IE', 'IE6388047V', true); //pass checksum fail
// testValidation('AU', '33102417032',true); //pass
// testValidation('SV', '0614-310506-103-7'); //pass
// testValidation('US', '94-1577458'); //pass
// testValidation('GE', '20100146115'); //pass
// testValidation('GR', 'EL094319905'); //pass
// testValidation('TR', '4300537632'); //pass
// testValidation('VN', '0101916423'); //pass

// testValidation('NL', 'NL817894352B01'); //checksum fail
// testValidation('PE', '20100146115'); //checksum fail
// testValidation('RO', 'RO16109528'); // checksum fail
// testValidation('RU', '7706061450'); //checksum fail
// testValidation('SE', 'SE559000594101'); //checksum fails
// testValidation('SI', 'SI90855498'); //checksum fails 
// testValidation('TW', '86707083'); //checksum fails
// testValidation('UY', '213722710013'); //checksum fails
// testValidation('ZA', '9848974535'); //checksum fails 
// testValidation('ES', 'B87723846'); //checksum fails 
// testValidation('FI', 'FI24882500'); //checksum fails 
// testValidation('HU', 'HU15082245'); //checksum fail
// testValidation('PL', 'PL5257596835'); //checksum fail
// testValidation('TH', '0105541000431'); //checksum fails

// testValidation('PT', '503873592'); //not working
// testValidation('RW', '1001867502'); //not working
// testValidation('SA', '9848/015/57/07'); //not working
// testValidation('SK', '2020528864'); //not working
// testValidation('UA', '2487568800'); //not working
// testValidation('FR', 'FR19323579133'); //not working
// testValidation('FO', 'DK13695092'); //not working
// testValidation('GB', 'GB232139171'); //not working
// testValidation('GH', '20100146115'); //not working
// testValidation('GT', '94-1577458'); //not working
// testValidation('HK', 'H99999999999999999'); //not working
// testValidation('HR', 'HR3829394862'); //not working
// testValidation('ID', '1690000021'); //not working
// testValidation('IE', 'IE6388047V'); //not working


//stdnum
// testValidation('at', 'ATU62123456') //checksum fail
// testValidation('be', 'BE0477472701') //checksum fail
// testValidation('bg', 'BG123456789') //chcksum fail
// testValidation('hr', 'HR95000000011') //checksum fail
// testValidation('cz', 'CZ67890123') //checksum fail
// testValidation('dk', 'DK12345678') //checksum fail
// testValidation('ee', 'EE100000123') //checksum fail
// testValidation('gb', 'GB123456789') //checksum fail
// testValidation('gr', 'EL999999999') //checksum fail
// testValidation('ie', 'IE6388047V') //checksum fail
// testValidation('it', 'IT01234560012') //checksum fail
// testValidation('lt', 'LT1234567890') //checksum fail
// testValidation('lu', 'LU21111111') //checksum fail
// testValidation('lv', 'LV40000000001') //checksum fail
// testValidation('pl', 'PL1234567890') //checksum fail


//chatgpt
// testValidation('AD', 'A-940421-J') //checksum fail

