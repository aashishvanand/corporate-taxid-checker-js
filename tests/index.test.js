const validateTaxId = require('../dist/taxid-validator.js'); 

test('Testing IN taxId 21WEKSQ0384LZE', async () => {
    const result = await validateTaxId('IN', '21WEKSQ0384LZE');
    expect(result.isValid).toBe(false);
});

test('Testing IN taxId 36AAGCG6803L1ZD', async () => {
    const result = await validateTaxId('IN', '36AAGCG6803L1ZD');
    expect(result.isValid).toBe(true);
});


test('Testing ZA taxId 4123456789', async () => {
    const result = await validateTaxId('ZA', '4123456789');
    expect(result.isValid).toBe(false);
});

test('Testing SG taxId 200817984R', async () => {
    const result = await validateTaxId('SG', '200817984R');
    expect(result.isValid).toBe(true);
});

test('Testing IE taxId IE6388047V', async () => {
    const result = await validateTaxId('IE', 'IE6388047V');
    expect(result.isValid).toBe(false);
});

test('Testing AU taxId 33102417032', async () => {
    const result = await validateTaxId('AU', '33102417032');
    expect(result.isValid).toBe(true);
});

test('Testing SV taxId 0614-310506-103-7', async () => {
    const result = await validateTaxId('SV', '0614-310506-103-7');
    expect(result.isValid).toBe(true);
});

test('Testing US taxId 94-1577458', async () => {
    const result = await validateTaxId('US', '94-1577458');
    expect(result.isValid).toBe(true);
});

test('Testing GE taxId 20100146115', async () => {
    const result = await validateTaxId('GE', '20100146115');
    expect(result.isValid).toBe(true);
});

test('Testing GR taxId EL094319905', async () => {
    const result = await validateTaxId('GR', 'EL094319905');
    expect(result.isValid).toBe(true);
});

test('Testing TR taxId 4300537632', async () => {
    const result = await validateTaxId('TR', '4300537632');
    expect(result.isValid).toBe(true);
});

test('Testing VN taxId 0101916423', async () => {
    const result = await validateTaxId('VN', '0101916423');
    expect(result.isValid).toBe(true);
});

