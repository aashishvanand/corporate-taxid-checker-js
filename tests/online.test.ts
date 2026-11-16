import validateTaxId, { validateTaxIds, checkOnline, getTaxIdInfo } from '../src/index';
import { normalizeForVies, getOnlineProvider } from '../src/online';

type Call = { url: string; init: any };

/** Builds a fake fetch that replies with the queued responses in order and records calls. */
function fakeFetch(...responses: Array<object | string | Error | ((call: Call) => any)>) {
    const calls: Call[] = [];
    const fn = jest.fn(async (url: string, init: any = {}) => {
        const call = { url, init };
        calls.push(call);
        let r = responses.length > 1 ? responses.shift()! : responses[0];
        if (typeof r === 'function') r = await r(call);
        if (r instanceof Error) throw r;
        if (r && typeof r === 'object' && 'status' in r && 'body' in r) {
            const { status, body } = r as { status: number; body: any };
            return new Response(typeof body === 'string' ? body : JSON.stringify(body), { status });
        }
        return new Response(typeof r === 'string' ? r : JSON.stringify(r), { status: 200 });
    });
    return { fetch: fn as unknown as typeof fetch, calls, mock: fn };
}

const VIES_VALID = { countryCode: 'BE', vatNumber: '0417497106', valid: true, name: 'NV Anheuser-Busch InBev', address: 'Grote Markt 1\n1000 Brussel' };
const VIES_INVALID = { countryCode: 'BE', vatNumber: '0417497106', valid: false, name: '---', address: '---' };
const viesError = (code: string) => ({ actionSucceed: false, errorWrappers: [{ error: code }] });

describe('normalizeForVies', () => {
    test('strips country prefix and separators', () => {
        expect(normalizeForVies('BE', 'be 0417.497.106')).toBe('0417497106');
        expect(normalizeForVies('DE', 'DE136695976')).toBe('136695976');
    });
    test('handles the EL prefix for Greece', () => {
        expect(normalizeForVies('GR', 'EL094014201')).toBe('094014201');
        expect(normalizeForVies('GR', 'GR094014201')).toBe('094014201');
    });
    test('reduces an 11-digit HU tax number to the 8-digit VAT core', () => {
        expect(normalizeForVies('HU', '12345678-1-23')).toBe('12345678');
    });
});

describe('getOnlineProvider', () => {
    test('maps EU to VIES, AU to ABR, others to null', () => {
        expect(getOnlineProvider('de')).toBe('vies');
        expect(getOnlineProvider('GR')).toBe('vies');
        expect(getOnlineProvider('AU')).toBe('abr');
        expect(getOnlineProvider('US')).toBeNull();
    });
});

describe('checkOnline — VIES', () => {
    test('valid number returns name/address and sends EL for Greece', async () => {
        const f = fakeFetch(VIES_VALID);
        const r = await checkOnline('BE', 'BE0417497106', { fetch: f.fetch });
        expect(r).toEqual({ status: 'valid', provider: 'vies', details: { name: 'NV Anheuser-Busch InBev', address: 'Grote Markt 1\n1000 Brussel' } });
        expect(f.calls[0].url).toContain('/vies/rest-api/check-vat-number');
        expect(JSON.parse(f.calls[0].init.body)).toEqual({ countryCode: 'BE', vatNumber: '0417497106' });

        const g = fakeFetch({ ...VIES_VALID, countryCode: 'EL' });
        await checkOnline('GR', 'EL094014201', { fetch: g.fetch });
        expect(JSON.parse(g.calls[0].init.body).countryCode).toBe('EL');
    });

    test('unregistered number is invalid', async () => {
        const f = fakeFetch(VIES_INVALID);
        expect(await checkOnline('BE', 'BE0417497106', { fetch: f.fetch })).toEqual({ status: 'invalid', provider: 'vies', reason: 'NOT_REGISTERED' });
    });

    test('transient VIES errors are retried, then succeed', async () => {
        const f = fakeFetch(viesError('MS_MAX_CONCURRENT_REQ'), VIES_VALID);
        const r = await checkOnline('BE', 'BE0417497106', { fetch: f.fetch, retries: 1 });
        expect(r.status).toBe('valid');
        expect(f.mock).toHaveBeenCalledTimes(2);
    });

    test('member state down after retries is unavailable, not invalid', async () => {
        const f = fakeFetch(viesError('MS_UNAVAILABLE'));
        const r = await checkOnline('DE', 'DE136695976', { fetch: f.fetch, retries: 0 });
        expect(r).toEqual({ status: 'unavailable', provider: 'vies', reason: 'MS_UNAVAILABLE' });
    });

    test('INVALID_INPUT is invalid and not retried', async () => {
        const f = fakeFetch(viesError('INVALID_INPUT'));
        const r = await checkOnline('BE', 'BE0417497106', { fetch: f.fetch, retries: 2 });
        expect(r.status).toBe('invalid');
        expect(f.mock).toHaveBeenCalledTimes(1);
    });

    test('HTTP errors and network failures are unavailable', async () => {
        const f = fakeFetch({ status: 502, body: 'Bad Gateway' });
        expect(await checkOnline('BE', 'BE0417497106', { fetch: f.fetch, retries: 0 })).toMatchObject({ status: 'unavailable', reason: 'HTTP_502' });
        const g = fakeFetch(new TypeError('fetch failed'));
        expect(await checkOnline('BE', 'BE0417497106', { fetch: g.fetch, retries: 0 })).toMatchObject({ status: 'unavailable', reason: 'NETWORK_ERROR' });
    });

    test('times out', async () => {
        const hang = (call: Call) => new Promise((_, reject) => {
            call.init.signal.addEventListener('abort', () => reject(new Error('aborted')));
        });
        const f = fakeFetch(hang);
        const r = await checkOnline('BE', 'BE0417497106', { fetch: f.fetch, timeoutMs: 20, retries: 0 });
        expect(r).toMatchObject({ status: 'unavailable', reason: 'TIMEOUT' });
    });

    test('unsupported country makes no request', async () => {
        const f = fakeFetch(VIES_VALID);
        expect(await checkOnline('US', '12-3456789', { fetch: f.fetch })).toEqual({ status: 'not_supported' });
        expect(f.mock).not.toHaveBeenCalled();
    });
});

describe('checkOnline — proxy endpoint', () => {
    test('POSTs countryCode/taxId to the endpoint and returns its result', async () => {
        const f = fakeFetch({ status: 'valid', provider: 'vies', details: { name: 'X' } });
        const r = await checkOnline('BE', 'BE0417497106', { fetch: f.fetch, endpoint: 'https://proxy.test/check' });
        expect(r).toEqual({ status: 'valid', provider: 'vies', details: { name: 'X' } });
        expect(f.calls[0].url).toBe('https://proxy.test/check');
        expect(JSON.parse(f.calls[0].init.body)).toEqual({ countryCode: 'BE', taxId: 'BE0417497106' });
    });
});

describe('checkOnline — ABR', () => {
    const abr = (o: object) => `c(${JSON.stringify({ Abn: '', AbnStatus: '', EntityName: '', Message: '', ...o })})`;

    test('without a GUID it is unavailable and makes no request', async () => {
        const prev = process.env.ABR_GUID;
        delete process.env.ABR_GUID;
        const f = fakeFetch('');
        expect(await checkOnline('AU', '51824753556', { fetch: f.fetch })).toEqual({ status: 'unavailable', provider: 'abr', reason: 'ABR_GUID_NOT_CONFIGURED' });
        expect(f.mock).not.toHaveBeenCalled();
        if (prev !== undefined) process.env.ABR_GUID = prev;
    });

    test('active ABN is valid with entity details', async () => {
        const f = fakeFetch(abr({ Abn: '51824753556', AbnStatus: 'Active', EntityName: 'AUSTRALIAN TAXATION OFFICE', AddressState: 'ACT', AddressPostcode: '2600' }));
        const r = await checkOnline('AU', '51 824 753 556', { fetch: f.fetch, abrGuid: 'g' });
        expect(r).toEqual({ status: 'valid', provider: 'abr', details: { name: 'AUSTRALIAN TAXATION OFFICE', address: 'ACT 2600', status: 'Active' } });
        expect(f.calls[0].url).toContain('abn=51824753556');
    });

    test('cancelled ABN is invalid; bad GUID is unavailable', async () => {
        const f = fakeFetch(abr({ Abn: '51824753556', AbnStatus: 'Cancelled' }));
        expect(await checkOnline('AU', '51824753556', { fetch: f.fetch, abrGuid: 'g' })).toMatchObject({ status: 'invalid', reason: 'NOT_ACTIVE' });
        const g = fakeFetch(abr({ Message: 'The GUID entered is not recognised as a Registered Party' }));
        expect(await checkOnline('AU', '51824753556', { fetch: g.fetch, abrGuid: 'bad' })).toMatchObject({ status: 'unavailable', reason: 'ABR_GUID_INVALID' });
    });
});

describe('validateTaxId with online checks', () => {
    test('a country without an online registry stays valid (regression: used to be isValid=false)', async () => {
        const f = fakeFetch(VIES_VALID);
        const r: any = await validateTaxId('US', '12-3456789', { online: true, fetch: f.fetch });
        expect(r.isValid).toBe(true);
        expect(r.onlineStatus).toBe('not_supported');
        expect(r.onlineCheck).toBe(false);
        expect(f.mock).not.toHaveBeenCalled();
    });

    test('a type without a checksum can be valid when online (regression: used to be always false)', async () => {
        const f = fakeFetch({ ...VIES_VALID, countryCode: 'IT' });
        const r: any = await validateTaxId('IT', 'IT00743110157', { online: true, fetch: f.fetch });
        expect(r.checkSumCheckPresent).toBe(false);
        expect(r.isValid).toBe(true);
        expect(r.onlineStatus).toBe('valid');
    });

    test('registry confirmation is surfaced with details', async () => {
        const f = fakeFetch(VIES_VALID);
        const r: any = await validateTaxId('BE', 'BE0417497106', { online: true, fetch: f.fetch });
        expect(r).toMatchObject({ isValid: true, checkSum: true, onlineCheck: true, onlineStatus: 'valid' });
        expect(r.onlineDetails.name).toBe('NV Anheuser-Busch InBev');
    });

    test('registry "not registered" makes the ID invalid', async () => {
        const f = fakeFetch(VIES_INVALID);
        const r: any = await validateTaxId('BE', 'BE0417497106', { online: true, fetch: f.fetch });
        expect(r).toMatchObject({ isValid: false, checkSum: true, onlineStatus: 'invalid' });
    });

    test('registry down does not invalidate, unless strict', async () => {
        const f = fakeFetch(viesError('MS_UNAVAILABLE'));
        const lax: any = await validateTaxId('BE', 'BE0417497106', { online: true, fetch: f.fetch, retries: 0 });
        expect(lax).toMatchObject({ isValid: true, onlineStatus: 'unavailable', onlineReason: 'MS_UNAVAILABLE' });
        const strict: any = await validateTaxId('BE', 'BE0417497106', { online: true, strict: true, fetch: f.fetch, retries: 0 });
        expect(strict.isValid).toBe(false);
    });

    test('a failed checksum skips the network call', async () => {
        const f = fakeFetch(VIES_VALID);
        const r: any = await validateTaxId('BE', 'BE0417497107', { online: true, fetch: f.fetch });
        expect(r).toMatchObject({ isValid: false, onlineStatus: 'skipped' });
        expect(f.mock).not.toHaveBeenCalled();
    });

    test('online not requested reports not_requested', async () => {
        const r: any = await validateTaxId('BE', 'BE0417497106');
        expect(r.onlineStatus).toBe('not_requested');
        expect(r.onlineCheckPresent).toBe(true);
    });

    test('getTaxIdInfo reports online availability', () => {
        const info = getTaxIdInfo('BE') as any[];
        expect(info.find((t) => t.type === 'be_vat').hasOnlineCheck).toBe(true);
    });
});

describe('validateTaxIds concurrency', () => {
    test('never runs more than `concurrency` lookups at once and keeps order', async () => {
        let inFlight = 0;
        let peak = 0;
        const f = fakeFetch(async () => {
            inFlight++;
            peak = Math.max(peak, inFlight);
            await new Promise((r) => setTimeout(r, 5));
            inFlight--;
            return VIES_VALID;
        });
        const items = Array.from({ length: 10 }, () => ({ countryCode: 'BE', taxId: 'BE0417497106' }));
        items[3] = { countryCode: 'US', taxId: '12-3456789' };
        const res = await validateTaxIds(items, { online: true, fetch: f.fetch, concurrency: 2 });
        expect(peak).toBeLessThanOrEqual(2);
        expect(res).toHaveLength(10);
        expect((res[3].result as any).onlineStatus).toBe('not_supported');
        expect((res[0].result as any).onlineStatus).toBe('valid');
    });
});
