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
/** Returns the registry that handles a country code, if any. */
export declare function getOnlineProvider(countryCode: string): 'vies' | 'abr' | null;
/**
 * Normalises a VAT number to the bare national part VIES expects:
 * uppercase, separators removed, country prefix (incl. EL for GR) removed.
 */
export declare function normalizeForVies(countryCode: string, taxId: string): string;
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
export declare function checkOnline(countryCode: string, taxId: string, options?: OnlineCheckOptions): Promise<OnlineCheckResult>;
