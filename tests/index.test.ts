import validateTaxId, { validateTaxIds, getSupportedCountries, isCountrySupported, getTaxIdInfo, sanitize, maskTaxId } from '../src/index';

// ============================================================================
// Andorra (AD)
// ============================================================================
test('AD valid NRT', async () => {
    const result = await validateTaxId('AD', 'A-123456-Z');
    expect(result.regexValid).toBe(true);
});
test('AD invalid NRT', async () => {
    const result = await validateTaxId('AD', '123456');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// United Arab Emirates (AE)
// ============================================================================
test('AE valid TRN', async () => {
    const result = await validateTaxId('AE', '100000000000003');
    expect(result.isValid).toBe(true);
});
test('AE invalid TRN', async () => {
    const result = await validateTaxId('AE', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Albania (AL)
// ============================================================================
test('AL valid NIPT', async () => {
    const result = await validateTaxId('AL', 'K91524014');
    expect(result.regexValid).toBe(true);
});
test('AL invalid NIPT', async () => {
    const result = await validateTaxId('AL', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Armenia (AM)
// ============================================================================
test('AM valid VAT', async () => {
    const result = await validateTaxId('AM', '1234567/1');
    expect(result.isValid).toBe(true);
});
test('AM invalid VAT', async () => {
    const result = await validateTaxId('AM', '123456');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Argentina (AR)
// ============================================================================
test('AR valid CUIT', async () => {
    const result = await validateTaxId('AR', '20-1234567-01');
    expect(result.regexValid).toBe(true);
});
test('AR invalid CUIT', async () => {
    const result = await validateTaxId('AR', '123456');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Austria (AT)
// ============================================================================
test('AT valid ABN', async () => {
    const result = await validateTaxId('AT', 'ATU62123456');
    expect(result.regexValid).toBe(true);
});
test('AT invalid ABN', async () => {
    const result = await validateTaxId('AT', '123456');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Australia (AU)
// ============================================================================
test('AU valid ABN', async () => {
    const result = await validateTaxId('AU', '33102417032');
    expect(result.isValid).toBe(true);
});
test('AU invalid ABN', async () => {
    const result = await validateTaxId('AU', '11111111111');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Azerbaijan (AZ)
// ============================================================================
test('AZ valid VAT', async () => {
    const result = await validateTaxId('AZ', '1234567891');
    expect(result.regexValid).toBe(true);
});
test('AZ invalid VAT', async () => {
    const result = await validateTaxId('AZ', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Bangladesh (BD)
// ============================================================================
test('BD valid BIN', async () => {
    const result = await validateTaxId('BD', '1234567890123');
    expect(result.isValid).toBe(true);
});
test('BD invalid BIN', async () => {
    const result = await validateTaxId('BD', '0234567890123');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Belgium (BE)
// ============================================================================
test('BE valid VAT', async () => {
    const result = await validateTaxId('BE', 'BE0477472701');
    expect(result.regexValid).toBe(true);
});
test('BE invalid VAT', async () => {
    const result = await validateTaxId('BE', '123456');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Bulgaria (BG)
// ============================================================================
test('BG valid VAT', async () => {
    const result = await validateTaxId('BG', 'BG123456789');
    expect(result.regexValid).toBe(true);
});
test('BG invalid VAT', async () => {
    const result = await validateTaxId('BG', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Bolivia (BO)
// ============================================================================
test('BO valid TIN', async () => {
    const result = await validateTaxId('BO', '123456789');
    expect(result.isValid).toBe(true);
});
test('BO invalid TIN', async () => {
    const result = await validateTaxId('BO', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Brazil (BR)
// ============================================================================
test('BR valid CNPJ', async () => {
    const result = await validateTaxId('BR', '11.222.333/0001-81');
    expect(result.regexValid).toBe(true);
});
test('BR invalid CNPJ', async () => {
    const result = await validateTaxId('BR', '123456');
    expect(result.isValid).toBe(false);
});
test('BR valid CPF', async () => {
    const result = await validateTaxId('BR', '123.456.789-09');
    expect(result.regexValid).toBe(true);
});

// ============================================================================
// Belarus (BY)
// ============================================================================
test('BY valid VAT', async () => {
    const result = await validateTaxId('BY', '123456789');
    expect(result.regexValid).toBe(true);
});
test('BY invalid VAT', async () => {
    const result = await validateTaxId('BY', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Belize (BZ)
// ============================================================================
test('BZ valid VAT', async () => {
    const result = await validateTaxId('BZ', '123-45-6789');
    expect(result.regexValid).toBe(true);
});
test('BZ invalid VAT', async () => {
    const result = await validateTaxId('BZ', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Canada (CA)
// ============================================================================
test('CA valid BN', async () => {
    const result = await validateTaxId('CA', '123456789');
    expect(result.regexValid).toBe(true);
});
test('CA valid GST/HST', async () => {
    const result = await validateTaxId('CA', '123456789RT0001');
    expect(result.isValid).toBe(true);
});
test('CA invalid BN', async () => {
    const result = await validateTaxId('CA', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Switzerland (CH)
// ============================================================================
test('CH valid VAT', async () => {
    const result = await validateTaxId('CH', 'CHE-123456789MWST');
    expect(result.regexValid).toBe(true);
});
test('CH invalid VAT', async () => {
    const result = await validateTaxId('CH', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Chile (CL)
// ============================================================================
test('CL valid RUT', async () => {
    const result = await validateTaxId('CL', '12.345.678-5');
    expect(result.regexValid).toBe(true);
});
test('CL invalid RUT', async () => {
    const result = await validateTaxId('CL', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// China (CN)
// ============================================================================
test('CN valid USCC', async () => {
    const result = await validateTaxId('CN', '123456789012345');
    expect(result.regexValid).toBe(true);
});
test('CN invalid USCC', async () => {
    const result = await validateTaxId('CN', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Colombia (CO)
// ============================================================================
test('CO valid NIT', async () => {
    const result = await validateTaxId('CO', '123.456.789-0');
    expect(result.regexValid).toBe(true);
});
test('CO invalid NIT', async () => {
    const result = await validateTaxId('CO', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Costa Rica (CR)
// ============================================================================
test('CR valid CPJ', async () => {
    const result = await validateTaxId('CR', '1-234-567890');
    expect(result.regexValid).toBe(true);
});
test('CR invalid CPJ', async () => {
    const result = await validateTaxId('CR', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Cyprus (CY)
// ============================================================================
test('CY valid VAT', async () => {
    const result = await validateTaxId('CY', 'CY12345678X');
    expect(result.regexValid).toBe(true);
});
test('CY invalid VAT', async () => {
    const result = await validateTaxId('CY', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Czech Republic (CZ)
// ============================================================================
test('CZ valid DIC', async () => {
    const result = await validateTaxId('CZ', 'CZ67890123');
    expect(result.regexValid).toBe(true);
});
test('CZ invalid DIC', async () => {
    const result = await validateTaxId('CZ', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Germany (DE)
// ============================================================================
test('DE valid VAT', async () => {
    const result = await validateTaxId('DE', 'DE123456789');
    expect(result.regexValid).toBe(true);
});
test('DE invalid VAT', async () => {
    const result = await validateTaxId('DE', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Denmark (DK)
// ============================================================================
test('DK valid CVR', async () => {
    const result = await validateTaxId('DK', 'DK12345678');
    expect(result.regexValid).toBe(true);
});
test('DK invalid CVR', async () => {
    const result = await validateTaxId('DK', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Dominican Republic (DO)
// ============================================================================
test('DO valid RNC', async () => {
    const result = await validateTaxId('DO', '123-4567890-1');
    expect(result.isValid).toBe(true);
});
test('DO invalid RNC', async () => {
    const result = await validateTaxId('DO', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Algeria (DZ)
// ============================================================================
test('DZ valid TIN', async () => {
    const result = await validateTaxId('DZ', 'P00ABCDE123');
    expect(result.isValid).toBe(true);
});
test('DZ invalid TIN', async () => {
    const result = await validateTaxId('DZ', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Ecuador (EC)
// ============================================================================
test('EC valid RUC', async () => {
    const result = await validateTaxId('EC', '1234567890001');
    expect(result.regexValid).toBe(true);
});
test('EC invalid RUC', async () => {
    const result = await validateTaxId('EC', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Estonia (EE)
// ============================================================================
test('EE valid VAT', async () => {
    const result = await validateTaxId('EE', 'EE100000123');
    expect(result.regexValid).toBe(true);
});
test('EE invalid VAT', async () => {
    const result = await validateTaxId('EE', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Egypt (EG)
// ============================================================================
test('EG valid TIN', async () => {
    const result = await validateTaxId('EG', '123456789');
    expect(result.regexValid).toBe(true);
});
test('EG invalid TIN', async () => {
    const result = await validateTaxId('EG', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Spain (ES)
// ============================================================================
test('ES valid CIF A28015865', async () => {
    const result = await validateTaxId('ES', 'A28015865');
    expect(result.isValid).toBe(true);
});
test('ES invalid CIF', async () => {
    const result = await validateTaxId('ES', 'B87723846');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Finland (FI)
// ============================================================================
test('FI valid ALV', async () => {
    const result = await validateTaxId('FI', 'FI24882500');
    expect(result.regexValid).toBe(true);
});
test('FI invalid ALV', async () => {
    const result = await validateTaxId('FI', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// France (FR)
// ============================================================================
test('FR valid NIF', async () => {
    const result = await validateTaxId('FR', '12 34 567 890 123');
    expect(result.regexValid).toBe(true);
});
test('FR valid VAT', async () => {
    const result = await validateTaxId('FR', 'FR19323579133');
    expect(result.regexValid).toBe(true);
});
test('FR invalid', async () => {
    const result = await validateTaxId('FR', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Faroe Islands (FO)
// ============================================================================
test('FO valid VAT', async () => {
    const result = await validateTaxId('FO', 'P00ABC12345');
    expect(result.isValid).toBe(true);
});
test('FO invalid VAT', async () => {
    const result = await validateTaxId('FO', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// United Kingdom (GB)
// ============================================================================
test('GB valid VAT', async () => {
    const result = await validateTaxId('GB', 'GB123456789');
    expect(result.regexValid).toBe(true);
});
test('GB invalid VAT', async () => {
    const result = await validateTaxId('GB', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Georgia (GE)
// ============================================================================
test('GE valid VAT', async () => {
    const result = await validateTaxId('GE', '20100146115');
    expect(result.isValid).toBe(true);
});
test('GE invalid VAT', async () => {
    const result = await validateTaxId('GE', '12');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Ghana (GH)
// ============================================================================
test('GH valid TIN', async () => {
    const result = await validateTaxId('GH', 'C0012345678');
    expect(result.regexValid).toBe(true);
});
test('GH invalid TIN', async () => {
    const result = await validateTaxId('GH', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Guinea (GN)
// ============================================================================
test('GN valid NIFP', async () => {
    const result = await validateTaxId('GN', '123-456-789');
    expect(result.regexValid).toBe(true);
});
test('GN invalid NIFP', async () => {
    const result = await validateTaxId('GN', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Greece (GR)
// ============================================================================
test('GR valid VAT', async () => {
    const result = await validateTaxId('GR', 'EL094319905');
    expect(result.isValid).toBe(true);
});
test('GR invalid VAT', async () => {
    const result = await validateTaxId('GR', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Guatemala (GT)
// ============================================================================
test('GT valid NIT', async () => {
    const result = await validateTaxId('GT', '1234567-8');
    expect(result.regexValid).toBe(true);
});
test('GT invalid NIT', async () => {
    const result = await validateTaxId('GT', 'ABCDEF');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Hong Kong (HK)
// ============================================================================
test('HK valid BR', async () => {
    const result = await validateTaxId('HK', '12345678');
    expect(result.isValid).toBe(true);
});
test('HK invalid BR', async () => {
    const result = await validateTaxId('HK', '1234');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Croatia (HR)
// ============================================================================
test('HR valid OIB', async () => {
    const result = await validateTaxId('HR', 'HR95000000011');
    expect(result.regexValid).toBe(true);
});
test('HR invalid OIB', async () => {
    const result = await validateTaxId('HR', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Hungary (HU)
// ============================================================================
test('HU valid ANUM', async () => {
    const result = await validateTaxId('HU', 'HU15082245');
    expect(result.regexValid).toBe(true);
});
test('HU invalid ANUM', async () => {
    const result = await validateTaxId('HU', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Indonesia (ID)
// ============================================================================
test('ID valid NPWP', async () => {
    const result = await validateTaxId('ID', '01.234.567.8-901.234');
    expect(result.regexValid).toBe(true);
});
test('ID invalid NPWP', async () => {
    const result = await validateTaxId('ID', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Ireland (IE)
// ============================================================================
test('IE valid VAT', async () => {
    const result = await validateTaxId('IE', 'IE1234567T');
    expect(result.regexValid).toBe(true);
});
test('IE invalid VAT', async () => {
    const result = await validateTaxId('IE', 'IE1234567X');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Israel (IL)
// ============================================================================
test('IL valid HP', async () => {
    const result = await validateTaxId('IL', '123456789');
    expect(result.regexValid).toBe(true);
});
test('IL invalid HP', async () => {
    const result = await validateTaxId('IL', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// India (IN)
// ============================================================================
test('IN valid GST', async () => {
    const result = await validateTaxId('IN', '36AAGCG6803L1ZD');
    expect(result.isValid).toBe(true);
});
test('IN invalid GST', async () => {
    const result = await validateTaxId('IN', '21WEKSQ0384LZE');
    expect(result.isValid).toBe(false);
});
test('IN valid PAN', async () => {
    const result = await validateTaxId('IN', 'ABCDE1234F');
    expect(result.regexValid).toBe(true);
});

// ============================================================================
// Iceland (IS)
// ============================================================================
test('IS valid VAT', async () => {
    const result = await validateTaxId('IS', '123456');
    expect(result.isValid).toBe(true);
});
test('IS invalid VAT', async () => {
    const result = await validateTaxId('IS', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Italy (IT)
// ============================================================================
test('IT valid IVA', async () => {
    const result = await validateTaxId('IT', 'IT01234560012');
    expect(result.regexValid).toBe(true);
});
test('IT invalid IVA', async () => {
    const result = await validateTaxId('IT', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Japan (JP)
// ============================================================================
test('JP valid CN', async () => {
    const result = await validateTaxId('JP', '1234567890123');
    expect(result.regexValid).toBe(true);
});
test('JP valid TRN', async () => {
    const result = await validateTaxId('JP', 'T1234567890123');
    expect(result.isValid).toBe(true);
});
test('JP invalid', async () => {
    const result = await validateTaxId('JP', 'ABCD');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Kenya (KE)
// ============================================================================
test('KE valid PIN', async () => {
    const result = await validateTaxId('KE', 'A123456789B');
    expect(result.isValid).toBe(true);
});
test('KE invalid PIN', async () => {
    const result = await validateTaxId('KE', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Cambodia (KH)
// ============================================================================
test('KH valid TIN', async () => {
    const result = await validateTaxId('KH', 'L001-123456789');
    expect(result.isValid).toBe(true);
});
test('KH invalid TIN', async () => {
    const result = await validateTaxId('KH', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// South Korea (KR)
// ============================================================================
test('KR valid BRN', async () => {
    const result = await validateTaxId('KR', '123-45-67890');
    expect(result.regexValid).toBe(true);
});
test('KR invalid BRN', async () => {
    const result = await validateTaxId('KR', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Liechtenstein (LI)
// ============================================================================
test('LI valid UID', async () => {
    const result = await validateTaxId('LI', 'CHE123456789');
    expect(result.isValid).toBe(true);
});
test('LI invalid UID', async () => {
    const result = await validateTaxId('LI', '1234');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Lithuania (LT)
// ============================================================================
test('LT valid PVM', async () => {
    const result = await validateTaxId('LT', 'LT1234567890');
    expect(result.regexValid).toBe(true);
});
test('LT invalid PVM', async () => {
    const result = await validateTaxId('LT', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Luxembourg (LU)
// ============================================================================
test('LU valid TVA', async () => {
    const result = await validateTaxId('LU', 'LU21111111');
    expect(result.regexValid).toBe(true);
});
test('LU invalid TVA', async () => {
    const result = await validateTaxId('LU', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Latvia (LV)
// ============================================================================
test('LV valid PVN', async () => {
    const result = await validateTaxId('LV', 'LV40000000001');
    expect(result.regexValid).toBe(true);
});
test('LV invalid PVN', async () => {
    const result = await validateTaxId('LV', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Morocco (MA)
// ============================================================================
test('MA valid ICE', async () => {
    const result = await validateTaxId('MA', '123456789012345');
    expect(result.regexValid).toBe(true);
});
test('MA invalid ICE', async () => {
    const result = await validateTaxId('MA', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Monaco (MC)
// ============================================================================
test('MC valid TVA', async () => {
    const result = await validateTaxId('MC', '12 34 567 890 123');
    expect(result.isValid).toBe(true);
});
test('MC invalid TVA', async () => {
    const result = await validateTaxId('MC', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Moldova (MD)
// ============================================================================
test('MD valid IDNO', async () => {
    const result = await validateTaxId('MD', '1234567890123');
    expect(result.regexValid).toBe(true);
});
test('MD invalid IDNO', async () => {
    const result = await validateTaxId('MD', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Montenegro (ME)
// ============================================================================
test('ME valid PIB', async () => {
    const result = await validateTaxId('ME', '12345678');
    expect(result.regexValid).toBe(true);
});
test('ME invalid PIB', async () => {
    const result = await validateTaxId('ME', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// North Macedonia (MK)
// ============================================================================
test('MK valid EDB', async () => {
    const result = await validateTaxId('MK', '1234567890123');
    expect(result.regexValid).toBe(true);
});
test('MK invalid EDB', async () => {
    const result = await validateTaxId('MK', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Malta (MT)
// ============================================================================
test('MT valid VAT', async () => {
    const result = await validateTaxId('MT', 'MT12345678');
    expect(result.regexValid).toBe(true);
});
test('MT invalid VAT', async () => {
    const result = await validateTaxId('MT', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Mexico (MX)
// ============================================================================
test('MX valid RFC', async () => {
    const result = await validateTaxId('MX', 'XAXX010101000');
    expect(result.regexValid).toBe(true);
});
test('MX invalid RFC', async () => {
    const result = await validateTaxId('MX', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Malaysia (MY)
// ============================================================================
test('MY valid FRP', async () => {
    const result = await validateTaxId('MY', '12345678');
    expect(result.isValid).toBe(true);
});
test('MY valid SST', async () => {
    const result = await validateTaxId('MY', 'A12-3456-78901234');
    expect(result.isValid).toBe(true);
});
test('MY invalid', async () => {
    const result = await validateTaxId('MY', 'XXXXX');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Nigeria (NG)
// ============================================================================
test('NG valid TIN', async () => {
    const result = await validateTaxId('NG', '12345678-9012');
    expect(result.isValid).toBe(true);
});
test('NG invalid TIN', async () => {
    const result = await validateTaxId('NG', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Netherlands (NL)
// ============================================================================
test('NL valid BTW', async () => {
    const result = await validateTaxId('NL', 'NL817894352B01');
    expect(result.regexValid).toBe(true);
});
test('NL invalid BTW', async () => {
    const result = await validateTaxId('NL', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Norway (NO)
// ============================================================================
test('NO valid MVA', async () => {
    const result = await validateTaxId('NO', '123456789MVA');
    expect(result.regexValid).toBe(true);
});
test('NO invalid MVA', async () => {
    const result = await validateTaxId('NO', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// New Zealand (NZ)
// ============================================================================
test('NZ valid IRD', async () => {
    const result = await validateTaxId('NZ', '123456789');
    expect(result.regexValid).toBe(true);
});
test('NZ invalid IRD', async () => {
    const result = await validateTaxId('NZ', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Peru (PE)
// ============================================================================
test('PE valid RUC', async () => {
    const result = await validateTaxId('PE', '20100146115');
    expect(result.regexValid).toBe(true);
});
test('PE invalid RUC', async () => {
    const result = await validateTaxId('PE', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Philippines (PH)
// ============================================================================
test('PH valid TIN', async () => {
    const result = await validateTaxId('PH', '123456789012');
    expect(result.isValid).toBe(true);
});
test('PH invalid TIN', async () => {
    const result = await validateTaxId('PH', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Poland (PL)
// ============================================================================
test('PL valid NIP', async () => {
    const result = await validateTaxId('PL', 'PL5257596835');
    expect(result.regexValid).toBe(true);
});
test('PL invalid NIP', async () => {
    const result = await validateTaxId('PL', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Portugal (PT)
// ============================================================================
test('PT valid NIF', async () => {
    const result = await validateTaxId('PT', 'PT503873592');
    expect(result.regexValid).toBe(true);
});
test('PT invalid NIF', async () => {
    const result = await validateTaxId('PT', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Paraguay (PY)
// ============================================================================
test('PY valid RUC', async () => {
    const result = await validateTaxId('PY', '12345678-9');
    expect(result.regexValid).toBe(true);
});
test('PY invalid RUC', async () => {
    const result = await validateTaxId('PY', 'ABCDEF');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Romania (RO)
// ============================================================================
test('RO valid CIF', async () => {
    const result = await validateTaxId('RO', 'RO16109528');
    expect(result.regexValid).toBe(true);
});
test('RO invalid CIF', async () => {
    const result = await validateTaxId('RO', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Serbia (RS)
// ============================================================================
test('RS valid PIB', async () => {
    const result = await validateTaxId('RS', '123456789');
    expect(result.regexValid).toBe(true);
});
test('RS invalid PIB', async () => {
    const result = await validateTaxId('RS', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Russia (RU)
// ============================================================================
test('RU valid INN', async () => {
    const result = await validateTaxId('RU', '7706061450');
    expect(result.regexValid).toBe(true);
});
test('RU invalid INN', async () => {
    const result = await validateTaxId('RU', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Rwanda (RW)
// ============================================================================
test('RW valid TIN', async () => {
    const result = await validateTaxId('RW', '123456789');
    expect(result.isValid).toBe(true);
});
test('RW invalid TIN', async () => {
    const result = await validateTaxId('RW', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Saudi Arabia (SA)
// ============================================================================
test('SA valid VAT', async () => {
    const result = await validateTaxId('SA', '300000000000003');
    expect(result.isValid).toBe(true);
});
test('SA invalid VAT', async () => {
    const result = await validateTaxId('SA', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Sweden (SE)
// ============================================================================
test('SE valid VAT', async () => {
    const result = await validateTaxId('SE', 'SE559000594101');
    expect(result.regexValid).toBe(true);
});
test('SE invalid VAT', async () => {
    const result = await validateTaxId('SE', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Singapore (SG)
// ============================================================================
test('SG valid UEN', async () => {
    const result = await validateTaxId('SG', '200817984R');
    expect(result.isValid).toBe(true);
});
test('SG invalid UEN', async () => {
    const result = await validateTaxId('SG', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Slovenia (SI)
// ============================================================================
test('SI valid DDV', async () => {
    const result = await validateTaxId('SI', 'SI90855498');
    expect(result.regexValid).toBe(true);
});
test('SI invalid DDV', async () => {
    const result = await validateTaxId('SI', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Slovakia (SK)
// ============================================================================
test('SK valid DPH', async () => {
    const result = await validateTaxId('SK', 'SK2020528864');
    expect(result.regexValid).toBe(true);
});
test('SK invalid DPH', async () => {
    const result = await validateTaxId('SK', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// San Marino (SM)
// ============================================================================
test('SM valid COE', async () => {
    const result = await validateTaxId('SM', 'SM123');
    expect(result.regexValid).toBe(true);
});
test('SM invalid COE', async () => {
    const result = await validateTaxId('SM', 'ABCDEFGH');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// El Salvador (SV)
// ============================================================================
test('SV valid NIT', async () => {
    const result = await validateTaxId('SV', '0614-310506-103-7');
    expect(result.isValid).toBe(true);
});
test('SV invalid NIT', async () => {
    const result = await validateTaxId('SV', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Thailand (TH)
// ============================================================================
test('TH valid TIN', async () => {
    const result = await validateTaxId('TH', '0105541000431');
    expect(result.regexValid).toBe(true);
});
test('TH invalid TIN', async () => {
    const result = await validateTaxId('TH', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Tunisia (TN)
// ============================================================================
test('TN valid MF', async () => {
    const result = await validateTaxId('TN', '1234567AAM000');
    expect(result.regexValid).toBe(true);
});
test('TN invalid MF', async () => {
    const result = await validateTaxId('TN', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Turkey (TR)
// ============================================================================
test('TR valid VKN', async () => {
    const result = await validateTaxId('TR', '4300537632');
    expect(result.isValid).toBe(true);
});
test('TR invalid VKN', async () => {
    const result = await validateTaxId('TR', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Taiwan (TW)
// ============================================================================
test('TW valid UBN', async () => {
    const result = await validateTaxId('TW', '86707083');
    expect(result.regexValid).toBe(true);
});
test('TW invalid UBN', async () => {
    const result = await validateTaxId('TW', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Ukraine (UA)
// ============================================================================
test('UA valid EDRPOU', async () => {
    const result = await validateTaxId('UA', '24875688');
    expect(result.regexValid).toBe(true);
});
test('UA invalid EDRPOU', async () => {
    const result = await validateTaxId('UA', '12');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// United States (US)
// ============================================================================
test('US valid EIN', async () => {
    const result = await validateTaxId('US', '94-1577458');
    expect(result.isValid).toBe(true);
});
test('US invalid EIN', async () => {
    const result = await validateTaxId('US', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Uruguay (UY)
// ============================================================================
test('UY valid RUT', async () => {
    const result = await validateTaxId('UY', '213722710013');
    expect(result.regexValid).toBe(true);
});
test('UY invalid RUT', async () => {
    const result = await validateTaxId('UY', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Venezuela (VE)
// ============================================================================
test('VE valid RIF', async () => {
    const result = await validateTaxId('VE', 'J-12345678-9');
    expect(result.regexValid).toBe(true);
});
test('VE invalid RIF', async () => {
    const result = await validateTaxId('VE', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Vietnam (VN)
// ============================================================================
test('VN valid MST', async () => {
    const result = await validateTaxId('VN', '0101916423');
    expect(result.isValid).toBe(true);
});
test('VN invalid MST', async () => {
    const result = await validateTaxId('VN', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// South Africa (ZA)
// ============================================================================
test('ZA valid TIN', async () => {
    const result = await validateTaxId('ZA', '9848974535');
    expect(result.regexValid).toBe(true);
});
test('ZA invalid TIN', async () => {
    const result = await validateTaxId('ZA', '4123456789');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Panama (PA)
// ============================================================================
test('PA valid RUC', async () => {
    const result = await validateTaxId('PA', '12-34-567890');
    expect(result.isValid).toBe(true);
});
test('PA invalid RUC', async () => {
    const result = await validateTaxId('PA', 'ABCDEF');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Nepal (NP)
// ============================================================================
test('NP valid PAN', async () => {
    const result = await validateTaxId('NP', '123456789');
    expect(result.isValid).toBe(true);
});
test('NP invalid PAN', async () => {
    const result = await validateTaxId('NP', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Pakistan (PK)
// ============================================================================
test('PK valid NTN', async () => {
    const result = await validateTaxId('PK', '1234567-8');
    expect(result.isValid).toBe(true);
});
test('PK invalid NTN', async () => {
    const result = await validateTaxId('PK', 'ABCDEF');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Sri Lanka (LK)
// ============================================================================
test('LK valid TIN', async () => {
    const result = await validateTaxId('LK', '123456789');
    expect(result.isValid).toBe(true);
});
test('LK invalid TIN', async () => {
    const result = await validateTaxId('LK', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Tanzania (TZ)
// ============================================================================
test('TZ valid TIN', async () => {
    const result = await validateTaxId('TZ', '123456789');
    expect(result.isValid).toBe(true);
});
test('TZ invalid TIN', async () => {
    const result = await validateTaxId('TZ', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Uganda (UG)
// ============================================================================
test('UG valid TIN', async () => {
    const result = await validateTaxId('UG', '1234567890');
    expect(result.isValid).toBe(true);
});
test('UG invalid TIN', async () => {
    const result = await validateTaxId('UG', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Ethiopia (ET)
// ============================================================================
test('ET valid TIN', async () => {
    const result = await validateTaxId('ET', '1234567890');
    expect(result.isValid).toBe(true);
});
test('ET invalid TIN', async () => {
    const result = await validateTaxId('ET', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Jamaica (JM)
// ============================================================================
test('JM valid TRN', async () => {
    const result = await validateTaxId('JM', '123456789');
    expect(result.isValid).toBe(true);
});
test('JM invalid TRN', async () => {
    const result = await validateTaxId('JM', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Trinidad and Tobago (TT)
// ============================================================================
test('TT valid BIR', async () => {
    const result = await validateTaxId('TT', '123456789');
    expect(result.isValid).toBe(true);
});
test('TT invalid BIR', async () => {
    const result = await validateTaxId('TT', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Bahrain (BH)
// ============================================================================
test('BH valid VAT', async () => {
    const result = await validateTaxId('BH', '100000000000003');
    expect(result.isValid).toBe(true);
});
test('BH invalid VAT', async () => {
    const result = await validateTaxId('BH', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Oman (OM)
// ============================================================================
test('OM valid VAT', async () => {
    const result = await validateTaxId('OM', 'OM1234567890');
    expect(result.isValid).toBe(true);
});
test('OM invalid VAT', async () => {
    const result = await validateTaxId('OM', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Qatar (QA)
// ============================================================================
test('QA valid TIN', async () => {
    const result = await validateTaxId('QA', '1234567890');
    expect(result.isValid).toBe(true);
});
test('QA invalid TIN', async () => {
    const result = await validateTaxId('QA', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Kuwait (KW)
// ============================================================================
test('KW valid TIN', async () => {
    const result = await validateTaxId('KW', '1234567890');
    expect(result.isValid).toBe(true);
});
test('KW invalid TIN', async () => {
    const result = await validateTaxId('KW', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Kazakhstan (KZ)
// ============================================================================
test('KZ valid TIN', async () => {
    const result = await validateTaxId('KZ', '123456789012');
    expect(result.isValid).toBe(true);
});
test('KZ invalid TIN', async () => {
    const result = await validateTaxId('KZ', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Barbados (BB)
// ============================================================================
test('BB valid TIN', async () => {
    const result = await validateTaxId('BB', '1934567890128');
    expect(result.isValid).toBe(true);
});
test('BB invalid TIN', async () => {
    const result = await validateTaxId('BB', '2934567890128');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Lebanon (LB)
// ============================================================================
test('LB valid TIN', async () => {
    const result = await validateTaxId('LB', '12345678901');
    expect(result.isValid).toBe(true);
});
test('LB invalid TIN', async () => {
    const result = await validateTaxId('LB', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Mauritius (MU)
// ============================================================================
test('MU valid TAN', async () => {
    const result = await validateTaxId('MU', '82345678');
    expect(result.isValid).toBe(true);
});
test('MU invalid TAN', async () => {
    const result = await validateTaxId('MU', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Uzbekistan (UZ)
// ============================================================================
test('UZ valid VAT', async () => {
    const result = await validateTaxId('UZ', '123456789');
    expect(result.isValid).toBe(true);
});
test('UZ invalid VAT', async () => {
    const result = await validateTaxId('UZ', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Gibraltar (GI)
// ============================================================================
test('GI valid TIN', async () => {
    const result = await validateTaxId('GI', '12345');
    expect(result.isValid).toBe(true);
});
test('GI invalid TIN', async () => {
    const result = await validateTaxId('GI', '1234');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Nicaragua (NI)
// ============================================================================
test('NI valid RUC', async () => {
    const result = await validateTaxId('NI', 'J0310000000016');
    expect(result.isValid).toBe(true);
});
test('NI invalid RUC', async () => {
    const result = await validateTaxId('NI', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Aruba (AW)
// ============================================================================
test('AW valid PN', async () => {
    const result = await validateTaxId('AW', '10565816');
    expect(result.isValid).toBe(true);
});
test('AW invalid PN', async () => {
    const result = await validateTaxId('AW', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Curacao (CW)
// ============================================================================
test('CW valid PN', async () => {
    const result = await validateTaxId('CW', '123456789');
    expect(result.isValid).toBe(true);
});
test('CW invalid PN', async () => {
    const result = await validateTaxId('CW', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Seychelles (SC)
// ============================================================================
test('SC valid TIN', async () => {
    const result = await validateTaxId('SC', '923456782');
    expect(result.isValid).toBe(true);
});
test('SC invalid TIN', async () => {
    const result = await validateTaxId('SC', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Kyrgyzstan (KG)
// ============================================================================
test('KG valid TIN', async () => {
    const result = await validateTaxId('KG', '12345678901234');
    expect(result.isValid).toBe(true);
});
test('KG invalid TIN', async () => {
    const result = await validateTaxId('KG', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Cuba (CU)
// ============================================================================
test('CU valid NI', async () => {
    const result = await validateTaxId('CU', '12345678901');
    expect(result.isValid).toBe(true);
});
test('CU invalid NI', async () => {
    const result = await validateTaxId('CU', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Guernsey (GG)
// ============================================================================
test('GG valid SIN', async () => {
    const result = await validateTaxId('GG', 'GY723453');
    expect(result.isValid).toBe(true);
});
test('GG invalid SIN', async () => {
    const result = await validateTaxId('GG', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Isle of Man (IM)
// ============================================================================
test('IM valid NINO', async () => {
    const result = await validateTaxId('IM', 'MA123456A');
    expect(result.isValid).toBe(true);
});
test('IM invalid NINO', async () => {
    const result = await validateTaxId('IM', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Anguilla (AI)
// ============================================================================
test('AI valid TIN', async () => {
    const result = await validateTaxId('AI', '2234567893');
    expect(result.isValid).toBe(true);
});
test('AI invalid TIN', async () => {
    const result = await validateTaxId('AI', '3234567893');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Antigua and Barbuda (AG)
// ============================================================================
test('AG valid TIN', async () => {
    const result = await validateTaxId('AG', '92345678');
    expect(result.isValid).toBe(true);
});
test('AG invalid TIN', async () => {
    const result = await validateTaxId('AG', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// St. Kitts and Nevis (KN)
// ============================================================================
test('KN valid TIN', async () => {
    const result = await validateTaxId('KN', '8341617');
    expect(result.isValid).toBe(true);
});
test('KN invalid TIN', async () => {
    const result = await validateTaxId('KN', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Maldives (MV)
// ============================================================================
test('MV valid TIN', async () => {
    const result = await validateTaxId('MV', '1000001PIT001');
    expect(result.isValid).toBe(true);
});
test('MV invalid TIN', async () => {
    const result = await validateTaxId('MV', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Marshall Islands (MH)
// ============================================================================
test('MH valid SSN', async () => {
    const result = await validateTaxId('MH', '04-086123');
    expect(result.isValid).toBe(true);
});
test('MH invalid SSN', async () => {
    const result = await validateTaxId('MH', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Samoa (WS)
// ============================================================================
test('WS valid TIN', async () => {
    const result = await validateTaxId('WS', '123456789');
    expect(result.isValid).toBe(true);
});
test('WS invalid TIN', async () => {
    const result = await validateTaxId('WS', '1234');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Sint Maarten (SX)
// ============================================================================
test('SX valid CRIB', async () => {
    const result = await validateTaxId('SX', '432364216');
    expect(result.isValid).toBe(true);
});
test('SX invalid CRIB', async () => {
    const result = await validateTaxId('SX', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Tajikistan (TJ)
// ============================================================================
test('TJ valid TIN', async () => {
    const result = await validateTaxId('TJ', '1234567890');
    expect(result.isValid).toBe(true);
});
test('TJ invalid TIN', async () => {
    const result = await validateTaxId('TJ', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Turkmenistan (TM)
// ============================================================================
test('TM valid TIN', async () => {
    const result = await validateTaxId('TM', '1234567890');
    expect(result.isValid).toBe(true);
});
test('TM invalid TIN', async () => {
    const result = await validateTaxId('TM', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Angola (AO) — Stripe
// ============================================================================
test('AO valid TIN (Stripe example)', async () => {
    const result = await validateTaxId('AO', '5123456789');
    expect(result.isValid).toBe(true);
});
test('AO invalid TIN', async () => {
    const result = await validateTaxId('AO', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Bosnia and Herzegovina (BA) — Stripe
// ============================================================================
test('BA valid TIN (Stripe example)', async () => {
    const result = await validateTaxId('BA', '123456789012');
    expect(result.isValid).toBe(true);
});
test('BA invalid TIN', async () => {
    const result = await validateTaxId('BA', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Burkina Faso (BF) — Stripe
// ============================================================================
test('BF valid IFU (Stripe example)', async () => {
    const result = await validateTaxId('BF', '12345678A');
    expect(result.isValid).toBe(true);
});
test('BF invalid IFU', async () => {
    const result = await validateTaxId('BF', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Benin (BJ) — Stripe
// ============================================================================
test('BJ valid IFU (Stripe example)', async () => {
    const result = await validateTaxId('BJ', '1234567890123');
    expect(result.isValid).toBe(true);
});
test('BJ invalid IFU', async () => {
    const result = await validateTaxId('BJ', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Bahamas (BS) — Stripe
// ============================================================================
test('BS valid TIN (Stripe example)', async () => {
    const result = await validateTaxId('BS', '123.456.789');
    expect(result.isValid).toBe(true);
});
test('BS invalid TIN', async () => {
    const result = await validateTaxId('BS', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Congo DR (CD) — Stripe
// ============================================================================
test('CD valid NIF (Stripe example)', async () => {
    const result = await validateTaxId('CD', 'A0123456M');
    expect(result.isValid).toBe(true);
});
test('CD invalid NIF', async () => {
    const result = await validateTaxId('CD', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Cameroon (CM) — Stripe
// ============================================================================
test('CM valid NIU (Stripe example)', async () => {
    const result = await validateTaxId('CM', 'M123456789000L');
    expect(result.isValid).toBe(true);
});
test('CM invalid NIU', async () => {
    const result = await validateTaxId('CM', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Cape Verde (CV) — Stripe
// ============================================================================
test('CV valid NIF (Stripe example)', async () => {
    const result = await validateTaxId('CV', '213456789');
    expect(result.isValid).toBe(true);
});
test('CV invalid NIF', async () => {
    const result = await validateTaxId('CV', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Laos (LA) — Stripe
// ============================================================================
test('LA valid TIN (Stripe example)', async () => {
    const result = await validateTaxId('LA', '123456789-000');
    expect(result.isValid).toBe(true);
});
test('LA invalid TIN', async () => {
    const result = await validateTaxId('LA', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Mauritania (MR) — Stripe
// ============================================================================
test('MR valid NIF (Stripe example)', async () => {
    const result = await validateTaxId('MR', '12345678');
    expect(result.isValid).toBe(true);
});
test('MR invalid NIF', async () => {
    const result = await validateTaxId('MR', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Senegal (SN) — Stripe
// ============================================================================
test('SN valid NINEA (Stripe example)', async () => {
    const result = await validateTaxId('SN', '12345672A2');
    expect(result.isValid).toBe(true);
});
test('SN invalid NINEA', async () => {
    const result = await validateTaxId('SN', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Suriname (SR) — Stripe
// ============================================================================
test('SR valid FIN (Stripe example)', async () => {
    const result = await validateTaxId('SR', '1234567890');
    expect(result.isValid).toBe(true);
});
test('SR invalid FIN', async () => {
    const result = await validateTaxId('SR', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Zambia (ZM) — Stripe
// ============================================================================
test('ZM valid TIN (Stripe example)', async () => {
    const result = await validateTaxId('ZM', '1004751879');
    expect(result.isValid).toBe(true);
});
test('ZM invalid TIN', async () => {
    const result = await validateTaxId('ZM', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Zimbabwe (ZW) — Stripe
// ============================================================================
test('ZW valid TIN (Stripe example)', async () => {
    const result = await validateTaxId('ZW', '1234567890');
    expect(result.isValid).toBe(true);
});
test('ZW invalid TIN', async () => {
    const result = await validateTaxId('ZW', '12345');
    expect(result.isValid).toBe(false);
});

// ============================================================================
// Stripe example values for existing countries (additional coverage)
// ============================================================================
test('AD valid NRT (Stripe example)', async () => {
    const result = await validateTaxId('AD', 'A-123456-Z');
    expect(result.regexValid).toBe(true);
});
test('AE valid TRN (Stripe example)', async () => {
    const result = await validateTaxId('AE', '123456789012345');
    expect(result.isValid).toBe(true);
});
test('AL valid TIN (Stripe example)', async () => {
    const result = await validateTaxId('AL', 'J12345678N');
    expect(result.regexValid).toBe(true);
});
test('AR valid CUIT (Stripe example)', async () => {
    const result = await validateTaxId('AR', '12-3456789-01');
    expect(result.regexValid).toBe(true);
});
test('AT valid EU VAT (Stripe example)', async () => {
    const result = await validateTaxId('AT', 'ATU12345678');
    expect(result.regexValid).toBe(true);
});
test('AU valid ABN (Stripe example)', async () => {
    const result = await validateTaxId('AU', '12345678912');
    expect(result.regexValid).toBe(true);
});
test('AZ valid TIN (Stripe example)', async () => {
    const result = await validateTaxId('AZ', '0123456789');
    expect(result.regexValid).toBe(true);
});
test('BB valid TIN (Stripe example)', async () => {
    const result = await validateTaxId('BB', '1123456789012');
    expect(result.regexValid).toBe(true);
});
test('BD valid BIN (Stripe example)', async () => {
    const result = await validateTaxId('BD', '123456789-0123');
    expect(result.regexValid).toBe(true);
});
test('BE valid EU VAT (Stripe example)', async () => {
    const result = await validateTaxId('BE', 'BE0123456789');
    expect(result.regexValid).toBe(true);
});
test('BG valid UIC (Stripe example)', async () => {
    const result = await validateTaxId('BG', '123456789');
    expect(result.isValid).toBe(true);
});
test('BG valid EU VAT (Stripe example)', async () => {
    const result = await validateTaxId('BG', 'BG0123456789');
    expect(result.regexValid).toBe(true);
});
test('BH valid VAT (Stripe example)', async () => {
    const result = await validateTaxId('BH', '123456789012345');
    expect(result.isValid).toBe(true);
});
test('BO valid TIN (Stripe example)', async () => {
    const result = await validateTaxId('BO', '123456789');
    expect(result.isValid).toBe(true);
});
test('BR valid CNPJ (Stripe example)', async () => {
    const result = await validateTaxId('BR', '01.234.456/5432-10');
    expect(result.regexValid).toBe(true);
});
test('BR valid CPF (Stripe example)', async () => {
    const result = await validateTaxId('BR', '123.456.789-87');
    expect(result.regexValid).toBe(true);
});
test('BY valid TIN (Stripe example)', async () => {
    const result = await validateTaxId('BY', '123456789');
    expect(result.regexValid).toBe(true);
});
test('CA valid BN (Stripe example)', async () => {
    const result = await validateTaxId('CA', '123456789');
    expect(result.regexValid).toBe(true);
});
test('CA valid GST/HST (Stripe example)', async () => {
    const result = await validateTaxId('CA', '123456789RT0002');
    expect(result.isValid).toBe(true);
});
test('CA valid PST BC (Stripe example)', async () => {
    const result = await validateTaxId('CA', 'PST-1234-5678');
    expect(result.isValid).toBe(true);
});
test('CA valid PST MB (Stripe example)', async () => {
    const result = await validateTaxId('CA', '123456-7');
    expect(result.isValid).toBe(true);
});
test('CA valid PST SK (Stripe example)', async () => {
    const result = await validateTaxId('CA', '1234567');
    expect(result.isValid).toBe(true);
});
test('CA valid QST (Stripe example)', async () => {
    const result = await validateTaxId('CA', '1234567890TQ1234');
    expect(result.regexValid).toBe(true);
});
test('CH valid VAT (Stripe example)', async () => {
    const result = await validateTaxId('CH', 'CHE-123.456.789 MWST');
    expect(result.regexValid).toBe(true);
});
test('CL valid TIN (Stripe example)', async () => {
    const result = await validateTaxId('CL', '12.345.678-K');
    expect(result.regexValid).toBe(true);
});
test('CN valid TIN (Stripe example)', async () => {
    const result = await validateTaxId('CN', '123456789012345678');
    expect(result.regexValid).toBe(true);
});
test('CO valid NIT (Stripe example)', async () => {
    const result = await validateTaxId('CO', '123.456.789-0');
    expect(result.regexValid).toBe(true);
});
test('CR valid TIN (Stripe example)', async () => {
    const result = await validateTaxId('CR', '1-234-567890');
    expect(result.regexValid).toBe(true);
});
test('CY valid EU VAT (Stripe example)', async () => {
    const result = await validateTaxId('CY', 'CY12345678Z');
    expect(result.regexValid).toBe(true);
});
test('CZ valid EU VAT (Stripe example)', async () => {
    const result = await validateTaxId('CZ', 'CZ1234567890');
    expect(result.regexValid).toBe(true);
});
test('DE valid EU VAT (Stripe example)', async () => {
    const result = await validateTaxId('DE', 'DE123456789');
    expect(result.regexValid).toBe(true);
});
test('DE valid Steuernummer (Stripe example)', async () => {
    const result = await validateTaxId('DE', '1234567890');
    expect(result.regexValid).toBe(true);
});
test('DK valid EU VAT (Stripe example)', async () => {
    const result = await validateTaxId('DK', 'DK12345678');
    expect(result.regexValid).toBe(true);
});
test('DO valid RCN (Stripe example)', async () => {
    const result = await validateTaxId('DO', '123-4567890-1');
    expect(result.isValid).toBe(true);
});
test('EC valid RUC (Stripe example)', async () => {
    const result = await validateTaxId('EC', '1234567890001');
    expect(result.regexValid).toBe(true);
});
test('EE valid EU VAT (Stripe example)', async () => {
    const result = await validateTaxId('EE', 'EE123456789');
    expect(result.regexValid).toBe(true);
});
test('EG valid TIN (Stripe example)', async () => {
    const result = await validateTaxId('EG', '123456789');
    expect(result.regexValid).toBe(true);
});
test('ES valid CIF (Stripe example)', async () => {
    const result = await validateTaxId('ES', 'A12345678');
    expect(result.regexValid).toBe(true);
});
test('ES valid EU VAT (Stripe example)', async () => {
    const result = await validateTaxId('ES', 'ESA1234567Z');
    expect(result.regexValid).toBe(true);
});
test('FI valid EU VAT (Stripe example)', async () => {
    const result = await validateTaxId('FI', 'FI12345678');
    expect(result.regexValid).toBe(true);
});
test('FR valid EU VAT (Stripe example)', async () => {
    const result = await validateTaxId('FR', 'FRAB123456789');
    expect(result.regexValid).toBe(true);
});
test('GB valid VAT (Stripe example)', async () => {
    const result = await validateTaxId('GB', 'GB123456789');
    expect(result.regexValid).toBe(true);
});
test('GN valid NIF (Stripe example)', async () => {
    const result = await validateTaxId('GN', '123456789');
    expect(result.regexValid).toBe(true);
});
test('GR valid EU VAT (Stripe example)', async () => {
    const result = await validateTaxId('GR', 'EL123456789');
    expect(result.regexValid).toBe(true);
});
test('HK valid BR (Stripe example)', async () => {
    const result = await validateTaxId('HK', '12345678');
    expect(result.isValid).toBe(true);
});
test('HR valid EU VAT (Stripe example)', async () => {
    const result = await validateTaxId('HR', 'HR12345678912');
    expect(result.regexValid).toBe(true);
});
test('HU valid EU VAT (Stripe example)', async () => {
    const result = await validateTaxId('HU', 'HU12345678');
    expect(result.regexValid).toBe(true);
});
test('HU valid TIN (Stripe example)', async () => {
    const result = await validateTaxId('HU', '12345678-1-23');
    expect(result.regexValid).toBe(true);
});
test('ID valid NPWP (Stripe example)', async () => {
    const result = await validateTaxId('ID', '012.345.678.9-012.345');
    expect(result.regexValid).toBe(true);
});
test('IE valid EU VAT (Stripe example)', async () => {
    const result = await validateTaxId('IE', 'IE1234567AB');
    expect(result.regexValid).toBe(true);
});
test('IL valid VAT (Stripe example)', async () => {
    const result = await validateTaxId('IL', '000012345');
    expect(result.regexValid).toBe(true);
});
test('IN valid GST (Stripe example)', async () => {
    const result = await validateTaxId('IN', '12ABCDE3456FGZH');
    expect(result.regexValid).toBe(true);
});
test('IS valid VAT (Stripe example)', async () => {
    const result = await validateTaxId('IS', '123456');
    expect(result.isValid).toBe(true);
});
test('IT valid EU VAT (Stripe example)', async () => {
    const result = await validateTaxId('IT', 'IT12345678912');
    expect(result.regexValid).toBe(true);
});
test('JP valid CN (Stripe example)', async () => {
    const result = await validateTaxId('JP', '1234567891234');
    expect(result.regexValid).toBe(true);
});
test('JP valid RN (Stripe example)', async () => {
    const result = await validateTaxId('JP', '12345');
    expect(result.isValid).toBe(true);
});
test('JP valid TRN (Stripe example)', async () => {
    const result = await validateTaxId('JP', 'T1234567891234');
    expect(result.isValid).toBe(true);
});
test('KE valid PIN (Stripe example)', async () => {
    const result = await validateTaxId('KE', 'P000111111A');
    expect(result.isValid).toBe(true);
});
test('KH valid TIN (Stripe example)', async () => {
    const result = await validateTaxId('KH', '1001-123456789');
    expect(result.isValid).toBe(true);
});
test('KR valid BRN (Stripe example)', async () => {
    const result = await validateTaxId('KR', '123-45-67890');
    expect(result.regexValid).toBe(true);
});
test('KZ valid BIN (Stripe example)', async () => {
    const result = await validateTaxId('KZ', '123456789012');
    expect(result.isValid).toBe(true);
});
test('LI valid UID (Stripe example)', async () => {
    const result = await validateTaxId('LI', 'CHE123456789');
    expect(result.isValid).toBe(true);
});
test('LI valid VAT (Stripe example)', async () => {
    const result = await validateTaxId('LI', '12345');
    expect(result.isValid).toBe(true);
});
test('LT valid EU VAT (Stripe example)', async () => {
    const result = await validateTaxId('LT', 'LT123456789123');
    expect(result.regexValid).toBe(true);
});
test('LU valid EU VAT (Stripe example)', async () => {
    const result = await validateTaxId('LU', 'LU12345678');
    expect(result.regexValid).toBe(true);
});
test('LV valid EU VAT (Stripe example)', async () => {
    const result = await validateTaxId('LV', 'LV12345678912');
    expect(result.regexValid).toBe(true);
});
test('MA valid VAT (Stripe example)', async () => {
    const result = await validateTaxId('MA', '12345678');
    expect(result.regexValid).toBe(true);
});
test('MD valid VAT (Stripe example)', async () => {
    const result = await validateTaxId('MD', '1234567');
    expect(result.regexValid).toBe(true);
});
test('ME valid PIB (Stripe example)', async () => {
    const result = await validateTaxId('ME', '12345678');
    expect(result.regexValid).toBe(true);
});
test('MK valid VAT (Stripe example)', async () => {
    const result = await validateTaxId('MK', 'MK1234567890123');
    expect(result.regexValid).toBe(true);
});
test('MT valid EU VAT (Stripe example)', async () => {
    const result = await validateTaxId('MT', 'MT12345678');
    expect(result.regexValid).toBe(true);
});
test('MX valid RFC (Stripe example)', async () => {
    const result = await validateTaxId('MX', 'ABC010203AB9');
    expect(result.regexValid).toBe(true);
});
test('NL valid EU VAT (Stripe example)', async () => {
    const result = await validateTaxId('NL', 'NL123456789B12');
    expect(result.regexValid).toBe(true);
});
test('NO valid MVA (Stripe example)', async () => {
    const result = await validateTaxId('NO', '123456789MVA');
    expect(result.regexValid).toBe(true);
});
test('NO valid VOEC (Stripe example)', async () => {
    const result = await validateTaxId('NO', '1234567');
    expect(result.isValid).toBe(true);
});
test('NZ valid GST (Stripe example)', async () => {
    const result = await validateTaxId('NZ', '123456789');
    expect(result.regexValid).toBe(true);
});
test('OM valid VAT (Stripe example)', async () => {
    const result = await validateTaxId('OM', 'OM1234567890');
    expect(result.isValid).toBe(true);
});
test('PE valid RUC (Stripe example)', async () => {
    const result = await validateTaxId('PE', '12345678901');
    expect(result.regexValid).toBe(true);
});
test('PH valid TIN (Stripe example)', async () => {
    const result = await validateTaxId('PH', '123456789012');
    expect(result.isValid).toBe(true);
});
test('PL valid EU VAT (Stripe example)', async () => {
    const result = await validateTaxId('PL', 'PL1234567890');
    expect(result.regexValid).toBe(true);
});
test('PT valid EU VAT (Stripe example)', async () => {
    const result = await validateTaxId('PT', 'PT123456789');
    expect(result.regexValid).toBe(true);
});
test('RO valid EU VAT (Stripe example)', async () => {
    const result = await validateTaxId('RO', 'RO1234567891');
    expect(result.regexValid).toBe(true);
});
test('RO valid TIN (Stripe example)', async () => {
    const result = await validateTaxId('RO', '1234567890123');
    expect(result.isValid).toBe(true);
});
test('RS valid PIB (Stripe example)', async () => {
    const result = await validateTaxId('RS', '123456789');
    expect(result.regexValid).toBe(true);
});
test('RU valid INN (Stripe example)', async () => {
    const result = await validateTaxId('RU', '1234567891');
    expect(result.regexValid).toBe(true);
});
test('SA valid VAT (Stripe example)', async () => {
    const result = await validateTaxId('SA', '123456789012345');
    expect(result.isValid).toBe(true);
});
test('SE valid EU VAT (Stripe example)', async () => {
    const result = await validateTaxId('SE', 'SE123456789101');
    expect(result.regexValid).toBe(true);
});
test('SG valid GST (Stripe example)', async () => {
    const result = await validateTaxId('SG', 'M12345678X');
    expect(result.isValid).toBe(true);
});
test('SG valid UEN (Stripe example)', async () => {
    const result = await validateTaxId('SG', '123456789F');
    expect(result.regexValid).toBe(true);
});
test('SI valid EU VAT (Stripe example)', async () => {
    const result = await validateTaxId('SI', 'SI12345678');
    expect(result.regexValid).toBe(true);
});
test('SI valid TIN (Stripe example)', async () => {
    const result = await validateTaxId('SI', '12345678');
    expect(result.isValid).toBe(true);
});
test('SK valid EU VAT (Stripe example)', async () => {
    const result = await validateTaxId('SK', 'SK1234567891');
    expect(result.regexValid).toBe(true);
});
test('SV valid NIT (Stripe example)', async () => {
    const result = await validateTaxId('SV', '1234-567890-123-4');
    expect(result.regexValid).toBe(true);
});
test('TH valid VAT (Stripe example)', async () => {
    const result = await validateTaxId('TH', '1234567891234');
    expect(result.regexValid).toBe(true);
});
test('TR valid TIN (Stripe example)', async () => {
    const result = await validateTaxId('TR', '0123456789');
    expect(result.regexValid).toBe(true);
});
test('TW valid VAT (Stripe example)', async () => {
    const result = await validateTaxId('TW', '12345678');
    expect(result.regexValid).toBe(true);
});
test('UA valid VAT (Stripe example)', async () => {
    const result = await validateTaxId('UA', '123456789');
    expect(result.regexValid).toBe(true);
});
test('US valid EIN (Stripe example)', async () => {
    const result = await validateTaxId('US', '12-3456789');
    expect(result.isValid).toBe(true);
});
test('UY valid RUC (Stripe example)', async () => {
    const result = await validateTaxId('UY', '123456789012');
    expect(result.regexValid).toBe(true);
});
test('UZ valid VAT (Stripe example)', async () => {
    const result = await validateTaxId('UZ', '123456789');
    expect(result.isValid).toBe(true);
});
test('VE valid RIF (Stripe example)', async () => {
    const result = await validateTaxId('VE', 'A-12345678-9');
    expect(result.regexValid).toBe(true);
});
test('VN valid TIN (Stripe example)', async () => {
    const result = await validateTaxId('VN', '1234567890');
    expect(result.regexValid).toBe(true);
});
test('ZA valid VAT (Stripe example)', async () => {
    const result = await validateTaxId('ZA', '4123456789');
    expect(result.regexValid).toBe(true);
});
test('ET valid TIN (Stripe example)', async () => {
    const result = await validateTaxId('ET', '1234567890');
    expect(result.isValid).toBe(true);
});
test('GE valid VAT (Stripe example)', async () => {
    const result = await validateTaxId('GE', '123456789');
    expect(result.regexValid).toBe(true);
});
test('KG valid TIN (Stripe example)', async () => {
    const result = await validateTaxId('KG', '12345678901234');
    expect(result.isValid).toBe(true);
});
test('NP valid PAN (Stripe example)', async () => {
    const result = await validateTaxId('NP', '123456789');
    expect(result.isValid).toBe(true);
});
test('NG valid TIN (Stripe example)', async () => {
    const result = await validateTaxId('NG', '12345678-0001');
    expect(result.isValid).toBe(true);
});
test('TJ valid TIN (Stripe example)', async () => {
    const result = await validateTaxId('TJ', '123456789');
    expect(result.isValid).toBe(true);
});
test('TZ valid VAT (Stripe example)', async () => {
    const result = await validateTaxId('TZ', '12345678A');
    expect(result.isValid).toBe(true);
});
test('UG valid TIN (Stripe example)', async () => {
    const result = await validateTaxId('UG', '1014751879');
    expect(result.isValid).toBe(true);
});

// ============================================================================
// Edge cases
// ============================================================================
test('Unknown country returns error', async () => {
    const result = await validateTaxId('XX', '12345');
    expect(result).toBe('Country code not found');
});
test('Case-insensitive country code', async () => {
    const result = await validateTaxId('us', '94-1577458');
    expect(result.isValid).toBe(true);
});

// ============================================================================
// validateTaxIds (bulk validation)
// ============================================================================
test('validateTaxIds returns results for all items', async () => {
    const items = [
        { countryCode: 'US', taxId: '94-1577458' },
        { countryCode: 'IN', taxId: '36AAGCG6803L1ZD' },
        { countryCode: 'DE', taxId: '123456789' },
    ];
    const results = await validateTaxIds(items);
    expect(results).toHaveLength(3);
    results.forEach((r, i) => {
        expect(r.countryCode).toBe(items[i].countryCode);
        expect(r.taxId).toBe(items[i].taxId);
        expect(r.result).toHaveProperty('isValid');
    });
});

test('validateTaxIds handles invalid country in batch', async () => {
    const items = [
        { countryCode: 'US', taxId: '94-1577458' },
        { countryCode: 'XX', taxId: '12345' },
    ];
    const results = await validateTaxIds(items);
    expect(results).toHaveLength(2);
    expect(results[0].result).toHaveProperty('isValid', true);
    expect(results[1].result).toBe('Country code not found');
});

test('validateTaxIds with empty array', async () => {
    const results = await validateTaxIds([]);
    expect(results).toEqual([]);
});

// ============================================================================
// getSupportedCountries
// ============================================================================
test('getSupportedCountries returns sorted array of country codes', () => {
    const countries = getSupportedCountries();
    expect(countries.length).toBeGreaterThan(100);
    expect(countries).toContain('US');
    expect(countries).toContain('IN');
    expect(countries).toContain('DE');
    // verify sorted
    const sorted = [...countries].sort();
    expect(countries).toEqual(sorted);
});

// ============================================================================
// isCountrySupported
// ============================================================================
test('isCountrySupported returns true for supported country', () => {
    expect(isCountrySupported('US')).toBe(true);
    expect(isCountrySupported('IN')).toBe(true);
});

test('isCountrySupported is case-insensitive', () => {
    expect(isCountrySupported('us')).toBe(true);
    expect(isCountrySupported('in')).toBe(true);
});

test('isCountrySupported returns false for unsupported country', () => {
    expect(isCountrySupported('XX')).toBe(false);
});

// ============================================================================
// getTaxIdInfo
// ============================================================================
test('getTaxIdInfo returns tax ID types for valid country', () => {
    const info = getTaxIdInfo('IN');
    expect(Array.isArray(info)).toBe(true);
    if (Array.isArray(info)) {
        expect(info.length).toBeGreaterThan(0);
        info.forEach((entry) => {
            expect(entry).toHaveProperty('label');
            expect(entry).toHaveProperty('type');
            expect(entry).toHaveProperty('hasChecksum');
            expect(entry).toHaveProperty('hasOnlineCheck');
        });
    }
});

test('getTaxIdInfo is case-insensitive', () => {
    const info = getTaxIdInfo('in');
    expect(Array.isArray(info)).toBe(true);
});

test('getTaxIdInfo returns error for unsupported country', () => {
    expect(getTaxIdInfo('XX')).toBe('Country code not found');
});

// ============================================================================
// maskTaxId
// ============================================================================
test('maskTaxId masks all but last 4 characters', () => {
    expect(maskTaxId('ATU62123456')).toBe('XXXXXXX3456');
});

test('maskTaxId preserves separators', () => {
    // 11 alphanumeric chars, last 4 visible = 7 masked
    expect(maskTaxId('20-1234567-01')).toBe('XX-XXXXX67-01');
});

test('maskTaxId with custom visible count', () => {
    expect(maskTaxId('ATU62123456', 2)).toBe('XXXXXXXXX56');
});

test('maskTaxId with custom mask character', () => {
    expect(maskTaxId('ATU62123456', 4, '*')).toBe('*******3456');
});

test('maskTaxId with zero visible count', () => {
    expect(maskTaxId('ATU62123456', 0)).toBe('XXXXXXXXXXX');
});

test('maskTaxId with empty string', () => {
    expect(maskTaxId('')).toBe('');
});

// ============================================================================
// sanitize
// ============================================================================
test('sanitize strips dashes and dots', () => {
    const [value, error] = sanitize('20-1234567-01');
    expect(error).toBeNull();
    expect(value).toBe('20123456701');
});

test('sanitize strips dots', () => {
    const [value, error] = sanitize('12.345.678');
    expect(error).toBeNull();
    expect(value).toBe('12345678');
});

test('sanitize strips slashes', () => {
    const [value, error] = sanitize('1234567/1');
    expect(error).toBeNull();
    expect(value).toBe('12345671');
});

test('sanitize uppercases input', () => {
    const [value, error] = sanitize('atu62123456');
    expect(error).toBeNull();
    expect(value).toBe('ATU62123456');
});

test('sanitize returns error for empty input', () => {
    const [, error] = sanitize('   ');
    expect(error).not.toBeNull();
});

// ============================================================================
// Territory aliasing
// ============================================================================
test('Territory alias GF (French Guiana) validates as FR', async () => {
    // French VAT should work with GF territory code
    const result = await validateTaxId('GF', 'FR40303265045');
    expect(typeof result).not.toBe('string');
    if (typeof result !== 'string') {
        expect(result.regexValid).toBe(true);
    }
});

test('Territory alias AX (Åland Islands) validates as FI', async () => {
    const result = await validateTaxId('AX', 'FI20774740');
    expect(typeof result).not.toBe('string');
    if (typeof result !== 'string') {
        expect(result.regexValid).toBe(true);
    }
});

test('isCountrySupported returns true for territory aliases', () => {
    expect(isCountrySupported('GF')).toBe(true);
    expect(isCountrySupported('GP')).toBe(true);
    expect(isCountrySupported('AX')).toBe(true);
});

test('getTaxIdInfo works with territory aliases', () => {
    const info = getTaxIdInfo('GF');
    expect(Array.isArray(info)).toBe(true);
});

// ============================================================================
// Entity type info in validation result
// ============================================================================
test('Validation result includes matchedType and matchedLabel', async () => {
    const result = await validateTaxId('DE', 'DE123456789');
    expect(typeof result).not.toBe('string');
    if (typeof result !== 'string') {
        expect(result.matchedType).toBeDefined();
        expect(result.matchedLabel).toBeDefined();
    }
});

test('Validation result has undefined matchedType for non-matching input', async () => {
    const result = await validateTaxId('DE', 'INVALID');
    expect(typeof result).not.toBe('string');
    if (typeof result !== 'string') {
        expect(result.matchedType).toBeUndefined();
        expect(result.isValid).toBe(false);
    }
});
