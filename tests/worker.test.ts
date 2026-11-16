import { handle } from '../worker/src/index';

const env = { ALLOWED_ORIGINS: 'https://demo.test' };
const post = (body: unknown, headers: Record<string, string> = {}) =>
    new Request('https://w.test/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Origin: 'https://demo.test', ...headers },
        body: typeof body === 'string' ? body : JSON.stringify(body),
    });

describe('online-check worker', () => {
    const realFetch = global.fetch;
    let upstream: jest.Mock;

    beforeEach(() => {
        upstream = jest.fn(async () => new Response(JSON.stringify({ valid: true, name: 'NV Anheuser-Busch InBev', address: '---' })));
        global.fetch = upstream as unknown as typeof fetch;
    });
    afterEach(() => {
        global.fetch = realFetch;
    });

    test('proxies a VIES check and sets CORS for an allowed origin', async () => {
        const res = await handle(post({ countryCode: 'be', taxId: 'BE0417497106' }), env);
        expect(res.status).toBe(200);
        expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://demo.test');
        expect(await res.json()).toEqual({ status: 'valid', provider: 'vies', details: { name: 'NV Anheuser-Busch InBev' } });
        expect(upstream.mock.calls[0][0]).toContain('/vies/rest-api/check-vat-number');
    });

    test('does not grant CORS to other origins', async () => {
        const res = await handle(post({ countryCode: 'BE', taxId: 'BE0417497106' }, { Origin: 'https://evil.test' }), env);
        expect(res.headers.get('Access-Control-Allow-Origin')).toBeNull();
    });

    test('answers preflight', async () => {
        const res = await handle(new Request('https://w.test/check', { method: 'OPTIONS', headers: { Origin: 'https://demo.test' } }), env);
        expect(res.status).toBe(204);
        expect(res.headers.get('Access-Control-Allow-Methods')).toContain('POST');
    });

    test('rejects malformed input without calling upstream', async () => {
        for (const body of ['not json', { countryCode: 'BEL', taxId: 'x' }, { countryCode: 'BE', taxId: 'https://evil/' }]) {
            const res = await handle(post(body), env);
            expect(res.status).toBe(400);
        }
        expect(upstream).not.toHaveBeenCalled();
    });

    test('unsupported country answers not_supported without calling upstream', async () => {
        const res = await handle(post({ countryCode: 'US', taxId: '12-3456789' }), env);
        expect(await res.json()).toEqual({ status: 'not_supported' });
        expect(upstream).not.toHaveBeenCalled();
    });

    test('rate limit returns 429', async () => {
        const res = await handle(post({ countryCode: 'BE', taxId: 'BE0417497106' }), {
            ...env,
            RATE_LIMITER: { limit: async () => ({ success: false }) },
        });
        expect(res.status).toBe(429);
        expect(upstream).not.toHaveBeenCalled();
    });

    test('also serves /api/check for same-origin routing', async () => {
        const req = new Request('https://corporate-taxid-checker-js.aashishvanand.me/api/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ countryCode: 'BE', taxId: 'BE0417497106' }),
        });
        expect((await (await handle(req, env)).json()).status).toBe('valid');
    });

    test('unknown paths and methods are refused', async () => {
        expect((await handle(new Request('https://w.test/other', { method: 'POST' }), env)).status).toBe(404);
        expect((await handle(new Request('https://w.test/check'), env)).status).toBe(405);
    });
});
