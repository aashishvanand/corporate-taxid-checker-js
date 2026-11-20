import { handle } from '../worker/src/index';

const env = {
    ALLOWED_ORIGINS: 'https://demo.test',
    RATE_LIMITER: { limit: async () => ({ success: true }) },
};
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
        expect(res.headers.get('X-Content-Type-Options')).toBe('nosniff');
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
        expect(res.headers.get('Access-Control-Allow-Headers')).toContain('Authorization');
    });

    test('requires the configured API token', async () => {
        const guarded = { ...env, API_TOKEN: 'secret-token' };
        for (const headers of [{}, { 'X-API-Token': 'wrong' }, { Authorization: 'Bearer wrong' }]) {
            const res = await handle(post({ countryCode: 'BE', taxId: 'BE0417497106' }, headers), guarded);
            expect(res.status).toBe(401);
            expect(await res.json()).toMatchObject({ reason: 'UNAUTHORIZED' });
        }
        expect(upstream).not.toHaveBeenCalled();

        for (const headers of [
            { 'X-API-Token': 'secret-token' },
            { Authorization: 'Bearer secret-token' },
        ]) {
            const res = await handle(post({ countryCode: 'BE', taxId: 'BE0417497106' }, headers), guarded);
            expect(res.status).toBe(200);
        }
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

    test('fails closed when the rate limiter binding is missing', async () => {
        const res = await handle(post({ countryCode: 'BE', taxId: 'BE0417497106' }), { ...env, RATE_LIMITER: undefined });
        expect(res.status).toBe(503);
        expect(await res.json()).toMatchObject({ reason: 'RATE_LIMITER_NOT_CONFIGURED' });
        expect(upstream).not.toHaveBeenCalled();
    });

    test('uses forwarded headers for the rate-limit key when CF-Connecting-IP is absent', async () => {
        const keys: string[] = [];
        await handle(post({ countryCode: 'BE', taxId: 'BE0417497106' }, { 'X-Forwarded-For': '203.0.113.7, 10.0.0.1' }), {
            ...env,
            RATE_LIMITER: { limit: async ({ key }: { key: string }) => { keys.push(key); return { success: true }; } },
        });
        expect(keys).toEqual(['203.0.113.7']);
    });

    test('rejects a locally impossible format before calling the registry', async () => {
        const res = await handle(post({ countryCode: 'AU', taxId: 'AU' }), env);
        expect(await res.json()).toEqual({ status: 'invalid', reason: 'LOCAL_FORMAT_MISMATCH' });
        expect(upstream).not.toHaveBeenCalled();
    });

    test('rejects a corrupted check digit before calling the registry', async () => {
        const res = await handle(post({ countryCode: 'BE', taxId: 'BE0417497107' }), env);
        expect(await res.json()).toEqual({ status: 'invalid', reason: 'LOCAL_CHECKSUM_MISMATCH' });
        expect(upstream).not.toHaveBeenCalled();
    });

    test('accepts a valid check digit and forwards the check', async () => {
        const res = await handle(post({ countryCode: 'BE', taxId: 'BE0417497106' }), env);
        expect(await res.json()).toMatchObject({ status: 'valid' });
        expect(upstream).toHaveBeenCalledTimes(1);
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

    test('enforces MAX_BODY by byte length, not character count', async () => {
        // 600 two-byte characters = 1200 bytes but only 600 UTF-16 code units.
        const res = await handle(post({ countryCode: 'BE', taxId: 'é'.repeat(600) }), env);
        expect(res.status).toBe(413);
        expect(upstream).not.toHaveBeenCalled();
    });

    test('enforces MAX_BODY on a streamed body with no Content-Length', async () => {
        const enc = new TextEncoder();
        const stream = new ReadableStream({
            start(c) {
                c.enqueue(enc.encode('{"countryCode":"BE","taxId":"'));
                c.enqueue(enc.encode('1'.repeat(2000)));
                c.enqueue(enc.encode('"}'));
            },
        });
        const req = new Request('https://w.test/check', {
            method: 'POST',
            headers: { Origin: 'https://demo.test' },
            body: stream,
            duplex: 'half',
        } as RequestInit);
        expect((await handle(req, env)).status).toBe(413);
        expect(upstream).not.toHaveBeenCalled();
    });
});
