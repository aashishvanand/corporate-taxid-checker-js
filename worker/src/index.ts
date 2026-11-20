/**
 * Online-check proxy for the corporate-taxid-checker-js demo.
 *
 * Browsers can't call VIES / ABN Lookup directly (no CORS headers), so the demo calls
 * this Worker instead:
 *
 *   validateTaxId('BE', 'BE0417497106', { online: true, endpoint: 'https://<worker>/check' })
 *
 * It is deliberately *not* an open proxy: it accepts only `{ countryCode, taxId }`,
 * only for countries with a wired-up registry, and only ever calls the fixed registry
 * URLs inside `checkOnline`. Results are cached at the edge and requests are rate-limited
 * per IP so the Worker's egress IPs don't get throttled by VIES.
 */
import { checkOnline, getOnlineProvider, normalizeForVies } from '../../src/online';
import type { OnlineCheckResult } from '../../src/online';
import { validateTaxId } from '../../src/index';

/**
 * Full offline validation (regex + check digit) before spending VIES / ABN quota.
 * The static validator registry in `src/validators/index.ts` lets Workers bundle the
 * same code path as Node and browsers, so a corrupted check digit never reaches the
 * registry.
 */
async function localValidationFailure(countryCode: string, taxId: string): Promise<string | null> {
    // VIES uses `EL` for Greece; the country data uses `GR`.
    const local = await validateTaxId(countryCode === 'EL' ? 'GR' : countryCode, taxId);
    if (typeof local === 'string' || !local.regexValid) return 'LOCAL_FORMAT_MISMATCH';
    if (local.checkSumCheckPresent && !local.checkSum) return 'LOCAL_CHECKSUM_MISMATCH';
    return null;
}

export interface Env {
    /** Comma-separated list of allowed origins, or "*". */
    ALLOWED_ORIGINS?: string;
    /** ABN Lookup GUID (secret): `wrangler secret put ABR_GUID` */
    ABR_GUID?: string;
    /**
     * Optional shared secret. When set, requests must send it as
     * `Authorization: Bearer <token>` or `X-API-Token: <token>`.
     * `wrangler secret put API_TOKEN`
     */
    API_TOKEN?: string;
    /** Workers Rate Limiting binding (see wrangler.jsonc). Optional. */
    RATE_LIMITER?: { limit(opts: { key: string }): Promise<{ success: boolean }> };
}

const VALID_TTL = 60 * 60 * 24; // registered numbers rarely get deregistered within a day
const INVALID_TTL = 60 * 60;    // short, so a newly registered number shows up quickly
const MAX_BODY = 1024;

function corsHeaders(req: Request, env: Env): Record<string, string> {
    const origin = req.headers.get('Origin') || '';
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
    const allow = allowed.includes('*') ? '*' : allowed.includes(origin) ? origin : '';
    const h: Record<string, string> = { Vary: 'Origin' };
    if (allow) {
        h['Access-Control-Allow-Origin'] = allow;
        h['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
        h['Access-Control-Allow-Headers'] = 'Content-Type, Accept, Authorization, X-API-Token';
        h['Access-Control-Max-Age'] = '86400';
    }
    return h;
}

function json(body: unknown, status: number, headers: Record<string, string>, extra: Record<string, string> = {}): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'X-Content-Type-Options': 'nosniff',
            ...headers,
            ...extra,
        },
    });
}

/**
 * Reads the request body, aborting as soon as it exceeds `limit` bytes.
 * A whole-body `req.text()` would buffer an oversized upload before the size check,
 * so concurrent large POSTs could exhaust isolate memory before returning 413.
 * `Content-Length` is only a fast path — the streamed byte count is authoritative.
 */
async function readBodyWithLimit(req: Request, limit: number): Promise<string | null> {
    const declared = Number(req.headers.get('content-length'));
    if (Number.isFinite(declared) && declared > limit) return null;
    if (!req.body) return '';

    const reader = req.body.getReader();
    const decoder = new TextDecoder();
    let total = 0;
    let text = '';
    try {
        for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            total += value.byteLength;
            if (total > limit) {
                await reader.cancel();
                return null;
            }
            text += decoder.decode(value, { stream: true });
        }
        text += decoder.decode();
        return text;
    } finally {
        try { reader.releaseLock(); } catch { /* already released by cancel */ }
    }
}

function cacheKey(countryCode: string, taxId: string): Request {
    // VIES accepts both GR and EL for Greece; they must share one cache entry.
    const canonical = countryCode === 'EL' ? 'GR' : countryCode;
    const id = getOnlineProvider(countryCode) === 'abr' ? taxId.replace(/\D/g, '') : normalizeForVies(countryCode, taxId);
    return new Request(`https://online-check.cache/${canonical}/${encodeURIComponent(id)}`);
}

/** Rate-limit key: Cloudflare always sets CF-Connecting-IP; fall back for other deployments. */
function clientKey(req: Request): string {
    const cf = req.headers.get('CF-Connecting-IP');
    if (cf) return cf;
    const forwarded = req.headers.get('X-Forwarded-For')?.split(',')[0]?.trim();
    if (forwarded) return forwarded;
    return req.headers.get('X-Real-IP')?.trim() || 'unknown';
}

function requestToken(req: Request): string {
    const auth = req.headers.get('Authorization') || '';
    if (auth.toLowerCase().startsWith('bearer ')) return auth.slice('bearer '.length).trim();
    return req.headers.get('X-API-Token')?.trim() || '';
}

/** Constant-time comparison so a wrong token cannot be guessed byte by byte. */
function tokensEqual(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return diff === 0;
}

export async function handle(req: Request, env: Env, ctx?: { waitUntil(p: Promise<unknown>): void }): Promise<Response> {
    const cors = corsHeaders(req, env);
    const url = new URL(req.url);

    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...cors, 'X-Content-Type-Options': 'nosniff' } });
    // "/check" on workers.dev, "/api/check" when routed on the demo's own hostname
    if (url.pathname !== '/check' && url.pathname !== '/api/check') return json({ error: 'not_found' }, 404, cors);
    if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405, cors, { Allow: 'POST, OPTIONS' });

    // Fail closed: without the binding there is no rate limit at all.
    if (!env.RATE_LIMITER) {
        return json({ status: 'unavailable', reason: 'RATE_LIMITER_NOT_CONFIGURED' }, 503, cors);
    }
    const { success } = await env.RATE_LIMITER.limit({ key: clientKey(req) });
    if (!success) return json({ status: 'unavailable', reason: 'RATE_LIMITED' }, 429, cors, { 'Retry-After': '60' });

    // Optional shared secret, for when CORS is not enough (non-browser clients).
    if (env.API_TOKEN && !tokensEqual(requestToken(req), env.API_TOKEN)) {
        return json({ status: 'unavailable', reason: 'UNAUTHORIZED' } satisfies OnlineCheckResult, 401, cors);
    }

    const raw = await readBodyWithLimit(req, MAX_BODY);
    if (raw === null) return json({ error: 'payload_too_large' }, 413, cors);
    let body: any;
    try {
        body = JSON.parse(raw);
    } catch {
        return json({ error: 'invalid_json' }, 400, cors);
    }

    const countryCode = typeof body?.countryCode === 'string' ? body.countryCode.toUpperCase() : '';
    const taxId = typeof body?.taxId === 'string' ? body.taxId.trim() : '';
    if (!/^[A-Z]{2}$/.test(countryCode) || !/^[A-Za-z0-9 . /-]{2,24}$/.test(taxId)) {
        return json({ error: 'invalid_input' }, 400, cors);
    }
    if (!getOnlineProvider(countryCode)) {
        return json({ status: 'not_supported' } satisfies OnlineCheckResult, 200, cors);
    }
    const failure = await localValidationFailure(countryCode, taxId);
    if (failure) {
        // Do not spend registry quota (or send an empty ABN) on a value that cannot be
        // that country's ID.
        return json({ status: 'invalid', reason: failure } satisfies OnlineCheckResult, 200, cors);
    }

    const cache = typeof caches !== 'undefined' ? (caches as any).default as Cache : undefined;
    const key = cacheKey(countryCode, taxId);
    if (cache) {
        const hit = await cache.match(key);
        if (hit) return json(await hit.json(), 200, cors, { 'X-Cache': 'HIT' });
    }

    const result = await checkOnline(countryCode, taxId, { abrGuid: env.ABR_GUID, timeoutMs: 8000, retries: 1 });

    // Never cache "unavailable": the next request should try the registry again
    const ttl = result.status === 'valid' ? VALID_TTL : result.status === 'invalid' ? INVALID_TTL : 0;
    if (cache && ttl > 0) {
        const put = cache.put(key, new Response(JSON.stringify(result), {
            headers: { 'Content-Type': 'application/json', 'Cache-Control': `public, max-age=${ttl}` },
        }));
        if (ctx) ctx.waitUntil(put); else await put;
    }

    return json(result, 200, cors, { 'X-Cache': 'MISS' });
}

export default {
    fetch(req: Request, env: Env, ctx: { waitUntil(p: Promise<unknown>): void }) {
        return handle(req, env, ctx);
    },
};
