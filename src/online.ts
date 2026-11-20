/**
 * Online verification against official registries.
 *
 * - EU member states: VIES (VAT Information Exchange System), which confirms the
 *   number is a *registered, active* VAT number and returns the trader name/address.
 * - Australia: ABN Lookup JSON web service (requires a free GUID from
 *   https://abr.business.gov.au/Tools/WebServices).
 *
 * Uses the global `fetch` (Node 18+, browsers, Cloudflare Workers, Deno, Bun),
 * so there are no runtime dependencies. Browsers cannot call these registries
 * directly (no CORS headers) — pass `endpoint` to route through a proxy such as
 * the Cloudflare Worker in `worker/`.
 */

/**
 * Outcome of an online check.
 *
 * - `valid`         — the registry confirmed the number is registered/active
 * - `invalid`       — the registry says the number is not registered (or inactive)
 * - `unavailable`   — the registry could not answer (down, rate-limited, timeout, misconfigured)
 * - `not_supported` — no online registry is wired up for this country / ID type
 * - `skipped`       — online check requested but not performed because regex/checksum already failed
 * - `not_requested` — online check was not requested
 */
export type OnlineStatus = 'valid' | 'invalid' | 'unavailable' | 'not_supported' | 'skipped' | 'not_requested';

/** Registry details returned on a successful lookup, when the registry provides them. */
export interface OnlineDetails {
    name?: string;
    address?: string;
    /** Registry-specific status text (e.g. ABR "Active" / "Cancelled") */
    status?: string;
}

/** Result of {@link checkOnline}. */
export interface OnlineCheckResult {
    status: OnlineStatus;
    /** Which registry answered (e.g. "vies", "abr") */
    provider?: string;
    details?: OnlineDetails;
    /** Machine-readable reason for `unavailable` / `invalid` (e.g. "MS_UNAVAILABLE", "TIMEOUT") */
    reason?: string;
}

/** Options controlling online verification. */
export interface OnlineCheckOptions {
    /** Per-request timeout in milliseconds. Default 10000. */
    timeoutMs?: number;
    /** Retries for transient registry errors (rate limits, member state down). Default 1. */
    retries?: number;
    /**
     * Proxy endpoint. When set, the library POSTs `{ countryCode, taxId }` as JSON to this URL
     * and expects an {@link OnlineCheckResult} back. Required in browsers.
     */
    endpoint?: string;
    /**
     * Extra headers sent to a configured proxy `endpoint`, for example an auth token
     * (`{ Authorization: 'Bearer …' }`) when the proxy requires one.
     */
    endpointHeaders?: Record<string, string>;
    /** Custom fetch implementation (for testing, or runtimes without a global fetch). */
    fetch?: typeof fetch;
    /** Abort signal to cancel in-flight requests. */
    signal?: AbortSignal;
    /** ABN Lookup GUID for Australian checks. Falls back to the ABR_GUID environment variable. */
    abrGuid?: string;
}

/** VIES uses EL for Greece and XI for Northern Ireland; everything else matches ISO 3166-1. */
const VIES_COUNTRIES: Record<string, string> = {
    AT: 'AT', BE: 'BE', BG: 'BG', CY: 'CY', CZ: 'CZ', DE: 'DE', DK: 'DK', EE: 'EE',
    ES: 'ES', FI: 'FI', FR: 'FR', GR: 'EL', EL: 'EL', HR: 'HR', HU: 'HU', IE: 'IE',
    IT: 'IT', LT: 'LT', LU: 'LU', LV: 'LV', MT: 'MT', NL: 'NL', PL: 'PL', PT: 'PT',
    RO: 'RO', SE: 'SE', SI: 'SI', SK: 'SK', XI: 'XI',
};

const VIES_URL = 'https://ec.europa.eu/taxation_customs/vies/rest-api/check-vat-number';
const ABR_URL = 'https://abr.business.gov.au/json/AbnDetails.aspx';

const DEFAULT_TIMEOUT_MS = 10000;
const MAX_RETRIES = 5;
const RETRY_BASE_MS = 500;
const RETRY_MAX_MS = 8000;

/** Registry calls may carry a Retry-After hint alongside a transient error. */
type AttemptResult = OnlineCheckResult & { retryAfterMs?: number };

function resolveTimeout(value: number | undefined): number {
    return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : DEFAULT_TIMEOUT_MS;
}

function resolveRetries(value: number | undefined): number {
    if (typeof value !== 'number' || !Number.isFinite(value)) return 1;
    return Math.max(0, Math.min(Math.floor(value), MAX_RETRIES));
}

/** Parses a Retry-After header (delay-seconds or HTTP-date) into milliseconds, capped. */
function parseRetryAfter(value: string | null): number | undefined {
    if (!value) return undefined;
    const seconds = Number(value);
    if (Number.isFinite(seconds) && seconds >= 0) {
        return Math.min(Math.round(seconds * 1000), RETRY_MAX_MS);
    }
    const date = Date.parse(value);
    if (!Number.isNaN(date)) {
        return Math.min(Math.max(0, date - Date.now()), RETRY_MAX_MS);
    }
    return undefined;
}

function withRetryAfter(result: AttemptResult, header: string | null): AttemptResult {
    const retryAfterMs = parseRetryAfter(header);
    if (retryAfterMs !== undefined) result.retryAfterMs = retryAfterMs;
    return result;
}

/** VIES error codes that mean "try again later", not "this number is invalid". */
const VIES_TRANSIENT = new Set([
    'MS_UNAVAILABLE', 'MS_MAX_CONCURRENT_REQ', 'GLOBAL_MAX_CONCURRENT_REQ',
    'SERVICE_UNAVAILABLE', 'TIMEOUT', 'SERVER_BUSY',
]);

/** Returns the registry that handles a country code, if any. */
export function getOnlineProvider(countryCode: string): 'vies' | 'abr' | null {
    const code = countryCode.toUpperCase();
    if (VIES_COUNTRIES[code]) return 'vies';
    if (code === 'AU') return 'abr';
    return null;
}

/**
 * Normalises a VAT number to the bare national part VIES expects:
 * uppercase, separators removed, country prefix (incl. EL for GR) removed.
 */
export function normalizeForVies(countryCode: string, taxId: string): string {
    const code = countryCode.toUpperCase();
    const viesCode = VIES_COUNTRIES[code] || code;
    let v = taxId.toUpperCase().replace(/[\s./-]/g, '');
    if (v.startsWith(viesCode)) v = v.substring(viesCode.length);
    else if (v.startsWith(code)) v = v.substring(code.length);
    // HU tax number "12345678-1-23": only the first 8 digits are the VAT core
    if (code === 'HU' && /^\d{11}$/.test(v)) v = v.substring(0, 8);
    return v;
}

class TimeoutError extends Error {}

/**
 * Runs `fetch` and `consume` inside one timeout/abort scope.
 *
 * The body must be read inside that scope: `fetch()` resolves as soon as the response
 * headers arrive, so clearing the timer there would let `res.json()` / `res.text()`
 * hang past `timeoutMs` — and a stalled lookup would hold its bulk-worker slot.
 */
async function withTimeout<T>(
    url: string,
    init: RequestInit,
    opts: OnlineCheckOptions,
    consume: (res: Response) => Promise<T>
): Promise<T> {
    const doFetch = opts.fetch || (typeof fetch !== 'undefined' ? fetch : undefined);
    if (!doFetch) throw new Error('No fetch implementation available; pass options.fetch');

    const controller = new AbortController();
    let timedOut = false;
    const timer = setTimeout(() => { timedOut = true; controller.abort(); }, resolveTimeout(opts.timeoutMs));
    const onAbort = () => controller.abort();
    if (opts.signal) {
        if (opts.signal.aborted) controller.abort();
        else opts.signal.addEventListener('abort', onAbort, { once: true });
    }
    try {
        const res = await doFetch(url, { ...init, signal: controller.signal });
        return await consume(res);
    } catch (err) {
        if (timedOut) throw new TimeoutError('timeout');
        throw err;
    } finally {
        clearTimeout(timer);
        opts.signal?.removeEventListener('abort', onAbort);
    }
}

function cleanField(v: unknown): string | undefined {
    if (typeof v !== 'string') return undefined;
    const t = v.trim();
    return t && t !== '---' ? t : undefined;
}

async function checkVies(countryCode: string, taxId: string, opts: OnlineCheckOptions): Promise<OnlineCheckResult> {
    const viesCode = VIES_COUNTRIES[countryCode.toUpperCase()];
    const vatNumber = normalizeForVies(countryCode, taxId);
    return withTimeout(VIES_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ countryCode: viesCode, vatNumber }),
    }, opts, async (res) => {
        if (!res.ok) return withRetryAfter({ status: 'unavailable', provider: 'vies', reason: `HTTP_${res.status}` }, res.headers.get('retry-after'));
        let body: any;
        try {
            body = await res.json();
        } catch (err) {
            // A 200 with an HTML maintenance page is not a network failure; an aborted
            // body read still is, and must surface as TIMEOUT.
            if (err instanceof SyntaxError || (err as Error)?.name === 'SyntaxError') {
                return { status: 'unavailable', provider: 'vies', reason: 'UNEXPECTED_RESPONSE' };
            }
            throw err;
        }

        if (body && body.actionSucceed === false) {
            const code = body.errorWrappers?.[0]?.error || 'UNKNOWN';
            if (code === 'INVALID_INPUT') return { status: 'invalid', provider: 'vies', reason: code };
            return { status: 'unavailable', provider: 'vies', reason: code };
        }

        // POST returns `valid`; the GET variant returns `isValid`
        const valid = body?.valid ?? body?.isValid;
        if (valid === true) {
            return {
                status: 'valid',
                provider: 'vies',
                details: { name: cleanField(body.name), address: cleanField(body.address) },
            };
        }
        if (valid === false) return { status: 'invalid', provider: 'vies', reason: 'NOT_REGISTERED' };
        return { status: 'unavailable', provider: 'vies', reason: 'UNEXPECTED_RESPONSE' };
    });
}

async function checkAbr(taxId: string, opts: OnlineCheckOptions): Promise<OnlineCheckResult> {
    const guid = opts.abrGuid
        || (typeof process !== 'undefined' && process.env ? process.env.ABR_GUID : undefined);
    if (!guid) return { status: 'unavailable', provider: 'abr', reason: 'ABR_GUID_NOT_CONFIGURED' };

    const abn = taxId.replace(/\D/g, '');
    const url = `${ABR_URL}?abn=${encodeURIComponent(abn)}&callback=c&guid=${encodeURIComponent(guid)}`;
    return withTimeout(url, { method: 'GET' }, opts, async (res) => {
        if (!res.ok) return withRetryAfter({ status: 'unavailable', provider: 'abr', reason: `HTTP_${res.status}` }, res.headers.get('retry-after'));

        // Response is JSONP: c({...})
        const text = await res.text();
        const json = text.substring(text.indexOf('(') + 1, text.lastIndexOf(')'));
        let body: any;
        try {
            body = JSON.parse(json);
        } catch {
            return { status: 'unavailable', provider: 'abr', reason: 'UNEXPECTED_RESPONSE' };
        }
        if (!body || typeof body !== 'object') {
            return { status: 'unavailable', provider: 'abr', reason: 'UNEXPECTED_RESPONSE' };
        }

        if (!body.Abn) {
            const msg: string = body.Message || '';
            if (/GUID/i.test(msg)) return { status: 'unavailable', provider: 'abr', reason: 'ABR_GUID_INVALID' };
            return { status: 'invalid', provider: 'abr', reason: msg || 'NOT_FOUND' };
        }

        const details: OnlineDetails = {
            name: cleanField(body.EntityName),
            address: cleanField([body.AddressState, body.AddressPostcode].filter(Boolean).join(' ')),
            status: cleanField(body.AbnStatus),
        };
        if (body.AbnStatus === 'Active') return { status: 'valid', provider: 'abr', details };
        return { status: 'invalid', provider: 'abr', details, reason: 'NOT_ACTIVE' };
    });
}

const PROXY_STATUSES = new Set<OnlineStatus>(['valid', 'invalid', 'unavailable', 'not_supported']);

/**
 * Validates a proxy's JSON reply instead of trusting it.
 *
 * The endpoint is caller-configured, but a compromised or buggy proxy must not be able to
 * inject an arbitrary `onlineStatus` (which flows into `isValid`) or extra `details` fields.
 */
function sanitizeProxyResponse(body: unknown): OnlineCheckResult {
    if (!body || typeof body !== 'object') {
        return { status: 'unavailable', reason: 'PROXY_UNEXPECTED_RESPONSE' };
    }
    const raw = body as Record<string, unknown>;
    if (typeof raw.status !== 'string' || !PROXY_STATUSES.has(raw.status as OnlineStatus)) {
        return { status: 'unavailable', reason: 'PROXY_UNEXPECTED_RESPONSE' };
    }

    const result: OnlineCheckResult = { status: raw.status as OnlineStatus };
    const provider = cleanField(raw.provider);
    if (provider) result.provider = provider;

    if (raw.details && typeof raw.details === 'object') {
        const d = raw.details as Record<string, unknown>;
        const details: OnlineDetails = {};
        const name = cleanField(d.name);
        const address = cleanField(d.address);
        const status = cleanField(d.status);
        if (name) details.name = name;
        if (address) details.address = address;
        if (status) details.status = status;
        if (Object.keys(details).length > 0) result.details = details;
    }

    const reason = cleanField(raw.reason);
    if (reason) result.reason = reason;
    return result;
}

async function checkViaEndpoint(countryCode: string, taxId: string, opts: OnlineCheckOptions): Promise<OnlineCheckResult> {
    return withTimeout(opts.endpoint as string, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...opts.endpointHeaders,
        },
        body: JSON.stringify({ countryCode, taxId }),
    }, opts, async (res) => {
        if (!res.ok) return withRetryAfter({ status: 'unavailable', reason: `PROXY_HTTP_${res.status}` }, res.headers.get('retry-after'));
        let body: unknown;
        try {
            body = await res.json();
        } catch (err) {
            if (err instanceof SyntaxError || (err as Error)?.name === 'SyntaxError') return { status: 'unavailable', reason: 'PROXY_UNEXPECTED_RESPONSE' };
            throw err;
        }
        return sanitizeProxyResponse(body);
    });
}

const sleep = (ms: number, signal?: AbortSignal) => new Promise<void>((resolve) => {
    if (signal?.aborted) return resolve();
    if (!signal) {
        setTimeout(resolve, ms);
        return;
    }
    const done = () => {
        clearTimeout(timer);
        signal.removeEventListener('abort', done);
        resolve();
    };
    const timer = setTimeout(done, ms);
    signal.addEventListener('abort', done, { once: true });
});

/** Exponential backoff (capped) with jitter, unless the registry sent Retry-After. */
function retryDelay(attempt: number, retryAfterMs: number | undefined): number {
    if (retryAfterMs !== undefined) return retryAfterMs;
    const backoff = Math.min(RETRY_MAX_MS, RETRY_BASE_MS * 2 ** (attempt - 1));
    return Math.round(backoff * (0.5 + Math.random() * 0.5));
}

/**
 * Verifies a tax ID against the country's official registry.
 * Never throws: network failures and registry errors resolve to `status: 'unavailable'`.
 *
 * @example
 * ```typescript
 * const r = await checkOnline('BE', 'BE0417497106');
 * // { status: 'valid', provider: 'vies', details: { name: 'NV Anheuser-Busch InBev', ... } }
 * ```
 */
export async function checkOnline(
    countryCode: string,
    taxId: string,
    options: OnlineCheckOptions = {}
): Promise<OnlineCheckResult> {
    const code = countryCode.toUpperCase();
    const provider = getOnlineProvider(code);
    if (!provider && !options.endpoint) return { status: 'not_supported' };

    const retries = resolveRetries(options.retries);
    let last: AttemptResult = { status: 'unavailable', provider: provider || undefined };
    let retryAfterMs: number | undefined;

    for (let attempt = 0; attempt <= retries; attempt++) {
        if (attempt > 0) {
            await sleep(retryDelay(attempt, retryAfterMs), options.signal);
            if (options.signal?.aborted) return { status: 'unavailable', provider: provider || undefined, reason: 'ABORTED' };
        }
        retryAfterMs = undefined;
        try {
            if (options.endpoint) last = await checkViaEndpoint(code, taxId, options);
            else if (provider === 'vies') last = await checkVies(code, taxId, options);
            else last = await checkAbr(taxId, options);
        } catch (err) {
            if (options.signal?.aborted) return { status: 'unavailable', provider: provider || undefined, reason: 'ABORTED' };
            last = {
                status: 'unavailable',
                provider: provider || undefined,
                reason: err instanceof TimeoutError ? 'TIMEOUT' : 'NETWORK_ERROR',
            };
        }
        retryAfterMs = last.retryAfterMs;
        const transient = last.status === 'unavailable'
            && (last.reason === undefined || last.reason === 'TIMEOUT' || last.reason === 'NETWORK_ERROR'
                || VIES_TRANSIENT.has(last.reason) || /^(PROXY_)?HTTP_(429|5\d\d)$/.test(last.reason));
        if (!transient) break;
    }
    const { retryAfterMs: _retryAfterMs, ...result } = last;
    return result;
}
