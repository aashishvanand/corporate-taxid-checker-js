import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const VIES_URL = 'https://ec.europa.eu/taxation_customs/tin/rest-api/tinRequest';

/**
 * Every EU VIES-backed validator's online_check strips a 2-letter country/msCode
 * prefix before sending the TIN to the shared REST endpoint. This suite locks in
 * that stripping behavior for every online-check-enabled validator, for both the
 * always-prefixed case and (where the format allows it) the bare domestic case —
 * the class of bug fixed for AT/DE/ES/HR/HU/PL/SE (unconditional `substring(2)`
 * corrupting input that has no prefix).
 */
interface Case {
    module: string;
    msCode: string;
    cases: { input: string; expectedTinNumber: string }[];
}

const configs: Case[] = [
    { module: 'AT', msCode: 'AT', cases: [
        { input: 'ATU12345678', expectedTinNumber: 'U12345678' },
        { input: 'U12345678', expectedTinNumber: 'U12345678' },
    ] },
    { module: 'BE', msCode: 'BE', cases: [
        { input: 'BE0123456789', expectedTinNumber: '0123456789' },
    ] },
    { module: 'BG', msCode: 'BG', cases: [
        { input: 'BG123456789', expectedTinNumber: '123456789' },
    ] },
    { module: 'CY', msCode: 'CY', cases: [
        { input: 'CY12345678X', expectedTinNumber: '12345678X' },
    ] },
    { module: 'CZ', msCode: 'CZ', cases: [
        { input: 'CZ12345678', expectedTinNumber: '12345678' },
    ] },
    { module: 'DE', msCode: 'DE', cases: [
        { input: 'DE123456789', expectedTinNumber: '123456789' },
    ] },
    { module: 'DK', msCode: 'DK', cases: [
        { input: 'DK12345678', expectedTinNumber: '12345678' },
    ] },
    { module: 'EE', msCode: 'EE', cases: [
        { input: 'EE123456789', expectedTinNumber: '123456789' },
    ] },
    { module: 'ES', msCode: 'ES', cases: [
        { input: 'ESA1234567Z', expectedTinNumber: 'A1234567Z' },
        { input: 'A12345678', expectedTinNumber: 'A12345678' },
    ] },
    { module: 'FI', msCode: 'FI', cases: [
        { input: 'FI12345678', expectedTinNumber: '12345678' },
    ] },
    { module: 'FR', msCode: 'FR', cases: [
        { input: 'FRAB123456789', expectedTinNumber: 'AB123456789' },
    ] },
    { module: 'GR', msCode: 'EL', cases: [
        { input: 'EL123456789', expectedTinNumber: '123456789' },
    ] },
    { module: 'HR', msCode: 'HR', cases: [
        { input: 'HR95000000011', expectedTinNumber: '95000000011' },
        { input: '95000000011', expectedTinNumber: '95000000011' },
    ] },
    { module: 'HU', msCode: 'HU', cases: [
        { input: 'HU15082245', expectedTinNumber: '15082245' },
        { input: '12345676-1-23', expectedTinNumber: '12345676' },
    ] },
    { module: 'IE', msCode: 'IE', cases: [
        { input: 'IE1234567AB', expectedTinNumber: '1234567AB' },
    ] },
    { module: 'IT', msCode: 'IT', cases: [
        { input: 'IT01234560012', expectedTinNumber: '01234560012' },
    ] },
    { module: 'LT', msCode: 'LT', cases: [
        { input: 'LT123456789123', expectedTinNumber: '123456789123' },
    ] },
    { module: 'LU', msCode: 'LU', cases: [
        { input: 'LU12345678', expectedTinNumber: '12345678' },
    ] },
    { module: 'LV', msCode: 'LV', cases: [
        { input: 'LV12345678912', expectedTinNumber: '12345678912' },
    ] },
    { module: 'MT', msCode: 'MT', cases: [
        { input: 'MT12345678', expectedTinNumber: '12345678' },
    ] },
    { module: 'NL', msCode: 'NL', cases: [
        { input: 'NL123456789B12', expectedTinNumber: '123456789B12' },
    ] },
    { module: 'PL', msCode: 'PL', cases: [
        { input: 'PL5257596835', expectedTinNumber: '5257596835' },
        { input: '5257596835', expectedTinNumber: '5257596835' },
    ] },
    { module: 'PT', msCode: 'PT', cases: [
        { input: 'PT123456789', expectedTinNumber: '123456789' },
    ] },
    { module: 'RO', msCode: 'RO', cases: [
        { input: 'RO1234567891', expectedTinNumber: '1234567891' },
    ] },
    { module: 'SE', msCode: 'SE', cases: [
        { input: 'SE559000594101', expectedTinNumber: '559000594101' },
        { input: '811218-9876', expectedTinNumber: '811218-9876' },
    ] },
    { module: 'SI', msCode: 'SI', cases: [
        { input: 'SI12345678', expectedTinNumber: '12345678' },
    ] },
    { module: 'SK', msCode: 'SK', cases: [
        { input: 'SK1234567891', expectedTinNumber: '1234567891' },
    ] },
];

describe('online_check TIN payload (VIES-backed validators)', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    for (const { module, msCode, cases } of configs) {
        describe(module, () => {
            for (const { input, expectedTinNumber } of cases) {
                test(`sends "${expectedTinNumber}" for input "${input}"`, async () => {
                    mockedAxios.post.mockResolvedValue({
                        status: 200,
                        data: { result: { structureValid: true, syntaxValid: true } }
                    });

                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    const { online_check } = require(`../../src/validators/${module}`);
                    await online_check(input);

                    expect(mockedAxios.post).toHaveBeenCalledWith(
                        VIES_URL,
                        { msCode, tinNumber: expectedTinNumber }
                    );
                });
            }
        });
    }
});
