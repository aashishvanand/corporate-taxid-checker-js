const validateTaxId = require('./index'); // Adjust the path if your file is located elsewhere

async function testValidation(countryCode, taxId, onlineCheck = false) {
    console.log(`Testing ${taxId} from ${countryCode}`);
    const result = await validateTaxId(countryCode, taxId, onlineCheck);
    console.log('-----------------------------');
    console.log(`Overall Validity:`, result.isValid);
    console.log(`Regex Valid:`, result.regexValid);
    console.log(`Checksum Valid`, result.checkSum);
    if (onlineCheck) {
    console.log(`Online Check:`, result.onlineCheck);
    }
    console.log('-----------------------------');
}



// Replace with your test cases
// testValidation('IN', '21WEKSQ0384LZE'); //fail
// testValidation('IN', '36AAGCG6803L1ZD'); //pass
// testValidation('SG','202018854C'); //pass
// testValidation('ZA', '4123456789'); //checksum fail


//google
// testValidation('SG','200817984R') //pass
// testValidation('IE', 'IE6388047V', true); //pass
// testValidation('NL', 'NL817894352B01'); //checksum fail
// testValidation('PE', '20100146115'); //checksum fail
// testValidation('PH', '000-629-598');
// testValidation('PL', '5262922449');
// testValidation('PT', '504 709 686');
// testValidation('RO', 'RO16109528');
// testValidation('RU', '7706061450');
// testValidation('RW', '1016202704');
// testValidation('SA', '3001505551');
// testValidation('SE', 'SE559000594101');
// testValidation('SG', '200817984R');
// testValidation('SI', 'SI90855498');
// testValidation('SK', '2024141876');
// testValidation('SV', '0614-310506-103-7');
// testValidation('TH', '105557056001');
// testValidation('TR', '20100146115');
// testValidation('TW', '86707083');
// testValidation('UA', '2729394862');
// testValidation('US', '94-1577458');
// testValidation('UY', '213722710013');
// testValidation('VN', '106540847');
// testValidation('ZA', '9848974535');
// testValidation('ES', 'B87723846');
// testValidation('EU', 'IE6388047V');
// testValidation('FI', 'FI24882500');
// testValidation('FR', 'FR323165653');
// testValidation('FO', 'DK13695092');
// testValidation('GB', 'GB232139171');
// testValidation('GE', '20100146115');
// testValidation('GH', '20100146115');
// testValidation('GR', 'EL094319905');
// testValidation('GT', '94-1577458');
// testValidation('HK', 'H99999999999999999');
// testValidation('HR', 'HR3829394862');
// testValidation('HU', 'HU15082245');
// testValidation('ID', '1690000021');
// testValidation('IE', 'IE6388047V');


//stdnum
// testValidation('ad', 'U-132950-X')

// testValidation('at', 'ATU62123456')

// testValidation('be', 'BE0477472701')

// testValidation('bg', 'BG123456789')

// testValidation('hr', 'HR95000000011')

// testValidation('cy', 'CY1234567L')

// testValidation('cz', 'CZ67890123')

// testValidation('de', 'DE1234567890')

// testValidation('dk', 'DK12345678')

// testValidation('ee', 'EE100000123')

// testValidation('es', 'ESB12345678')

// testValidation('fi', 'FI2345678-9')

// testValidation('fr', 'FR123456789012345')

// testValidation('gb', 'GB123456789')

// testValidation('gr', 'EL999999999')

// testValidation('hu', 'HU12345678-9-0')

// testValidation('ie', 'IE6388047V')

// testValidation('it', 'IT01234560012')

// testValidation('lt', 'LT1234567890')
// testValidation('lu', 'LU21111111')

// testValidation('lv', 'LV40000000001')

// testValidation('mt', 'MT1234567')

// testValidation('nl', 'NL8212345678B01')

// testValidation('no', '987654321')

// testValidation('pl', 'PL1234567890')


//chatgpt
// testValidation('AD', 'A-940421-J')
// testValidation('AD', 'G-369168-V')
// testValidation('AD', 'C-901341-P')
// testValidation('AD', 'C-667464-S')
// testValidation('AD', 'C-422987-K')



