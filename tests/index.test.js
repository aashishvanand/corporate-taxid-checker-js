const validateTaxId = require('../src/index.js'); 

test('Testing IN taxId 21WEKSQ0384LZE', async () => {
    const result = await validateTaxId('IN', '21WEKSQ0384LZE');
    expect(result.isValid).toBe(false);
});

test('Testing IN taxId 36AAGCG6803L1ZD', async () => {
    const result = await validateTaxId('IN', '36AAGCG6803L1ZD');
    expect(result.isValid).toBe(true);
});

