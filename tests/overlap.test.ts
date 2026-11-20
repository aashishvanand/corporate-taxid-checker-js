/**
 * Regression tests for overlapping entries within one country.
 *
 * A country may list a broad, checksum-less format and a narrower format with a checksum
 * for the same value. The first regex match must not short-circuit the loop when its
 * checksum fails (or when it has no checksum and a later entry can prove the check digit).
 *
 * The country data is mocked so the overlap is deterministic.
 */
jest.mock('../src/data.json', () => [
    {
        Country: 'Testland',
        ISOCountryCode: 'ZZ',
        data: [
            { label: 'Testland generic number', type: 'zz_generic', regex: '^\\d{9}$', checksum: false },
            { label: 'Testland checked number', type: 'zz_checked', regex: '^\\d{9}$', checksum: true },
        ],
    },
]);

jest.mock('../src/validators', () => ({
    // Only ZZ is needed here; the mock checksum passes only when the value ends in 2.
    validators: {
        ZZ: { validate_zz_checked: (value: string) => value.endsWith('2') },
    },
}));

import { validateTaxId } from '../src/index';

describe('overlapping country entries', () => {
    test('prefers the entry whose checksum passes over an earlier checksum-less match', async () => {
        const result: any = await validateTaxId('ZZ', '123456782');
        expect(result).toMatchObject({
            isValid: true,
            matchedType: 'zz_checked',
            checkSumCheckPresent: true,
            checkSum: true,
        });
    });

    test('falls back to the checksum-less match when no checksum passes', async () => {
        const result: any = await validateTaxId('ZZ', '123456789');
        expect(result).toMatchObject({
            isValid: true,
            matchedType: 'zz_generic',
            checkSumCheckPresent: false,
            checkSum: false,
        });
    });
});
