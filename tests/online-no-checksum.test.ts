/**
 * Regression test for online checks on an ID type that has no check digit.
 *
 * All currently online-capable types have one, so this exercises the branch with mocked
 * country data: a registry-confirmed ID must be `isValid` even when `checkSumCheckPresent`
 * is false (it used to be always false).
 */
jest.mock('../src/data.json', () => [
    {
        Country: 'Belgium',
        ISOCountryCode: 'BE',
        data: [
            { label: 'Belgian VAT (test)', type: 'be_vat', regex: '^BE\\d{10}$', checksum: false, online: true },
        ],
    },
]);

import { validateTaxId } from '../src/index';

test('a checksum-less type can be valid when the registry confirms it', async () => {
    const fetch = jest.fn(async () =>
        new Response(JSON.stringify({
            countryCode: 'BE',
            vatNumber: '0417497106',
            valid: true,
            name: 'NV Anheuser-Busch InBev',
            address: '---',
        }), { status: 200 })
    ) as unknown as typeof global.fetch;

    const result: any = await validateTaxId('BE', 'BE0417497106', { online: true, fetch });
    expect(result.checkSumCheckPresent).toBe(false);
    expect(result.isValid).toBe(true);
    expect(result.onlineStatus).toBe('valid');
});
