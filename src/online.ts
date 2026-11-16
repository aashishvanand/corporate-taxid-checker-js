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
    let v = taxId.toUpperCase().replace(/[\s.\-\/]/g, '');
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
    const timer = setTimeout(() => { timedOut = true; controller.abort(); }, opts.timeoutMs ?? 10000);
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
        if (!res.ok) return { status: 'unavailable', provider: 'vies', reason: `HTTP_${res.status}` };
        const body: any = await res.json();

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
        if (!res.ok) return { status: 'unavailable', provider: 'abr', reason: `HTTP_${res.status}` };

        // Response is JSONP: c({...})
        const text = await res.text();
        const json = text.substring(text.indexOf('(') + 1, text.lastIndexOf(')'));
        let body: any;
        try {
            body = JSON.parse(json);
        } catch {
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

async function checkViaEndpoint(countryCode: string, taxId: string, opts: OnlineCheckOptions): Promise<OnlineCheckResult> {
    return withTimeout(opts.endpoint as string, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ countryCode, taxId }),
    }, opts, async (res) => {
        if (!res.ok) return { status: 'unavailable', reason: `PROXY_HTTP_${res.status}` };
        const body: any = await res.json();
        if (!body || typeof body.status !== 'string') return { status: 'unavailable', reason: 'PROXY_UNEXPECTED_RESPONSE' };
        return body as OnlineCheckResult;
    });
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

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

    const retries = Math.max(0, options.retries ?? 1);
    let last: OnlineCheckResult = { status: 'unavailable', provider: provider || undefined };

    for (let attempt = 0; attempt <= retries; attempt++) {
        if (attempt > 0) await sleep(500 * 2 ** (attempt - 1));
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
        const transient = last.status === 'unavailable'
            && (last.reason === undefined || last.reason === 'TIMEOUT' || last.reason === 'NETWORK_ERROR'
                || VIES_TRANSIENT.has(last.reason) || /^(PROXY_)?HTTP_5\d\d$/.test(last.reason));
        if (!transient) break;
    }
    return last;
}
