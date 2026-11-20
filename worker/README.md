# Online-check proxy Worker

Browsers can't call VIES or ABN Lookup directly (neither sends CORS headers). This Cloudflare
Worker sits in between for the demo site. It reuses `src/online.ts` from the library, so the
Worker and the npm package always use the same registry logic.

```
browser ──POST /check {countryCode, taxId}──▶ Worker ──▶ VIES / ABN Lookup
        ◀── { status, provider, details } ───        (edge-cached)
```

What keeps it safe and cheap:

- **Not an open proxy:** it accepts only `{ countryCode, taxId }` with a strict character set, only for countries that have a registry, runs the full local validation (regex **and** check digit) first, and only calls the fixed registry URLs.
- **CORS allowlist:** only origins in `ALLOWED_ORIGINS` can read responses from a browser.
- **Optional shared secret:** set `API_TOKEN` and every request must send `Authorization: Bearer <token>` or `X-API-Token: <token>`. This stops non-browser clients that ignore CORS. The comparison is constant-time.
- **Per-IP rate limit:** 20 requests a minute through the Workers Rate Limiting binding, which also stops the Worker's egress IPs from being throttled by VIES. The Worker fails closed (503) if the binding is missing.
- **Edge cache:** `valid` results are cached for 24 h and `invalid` for 1 h. `unavailable` is never cached, so a registry outage clears up on its own. GR and EL share one cache entry.

## Deploy

```bash
cd worker
npm install
# set ALLOWED_ORIGINS in wrangler.jsonc to your demo's origin(s)
npx wrangler secret put ABR_GUID    # optional, enables Australian ABN checks
npx wrangler secret put API_TOKEN   # optional, requires Authorization/X-API-Token
npx wrangler deploy
```

Then, in the demo:

```javascript
validateTaxId(country, taxId, {
    online: true,
    endpoint: 'https://taxid-online-check.<account>.workers.dev/check',
    // Only when API_TOKEN is configured:
    endpointHeaders: { Authorization: 'Bearer <token>' },
});
```

### Same-origin option

`aashishvanand.me` is on Cloudflare, so the Worker can also run on the demo's own hostname.
Uncomment `routes` in `wrangler.jsonc`, deploy, and use `endpoint: '/api/check'`. Requests
are then same-origin and need no CORS. Make sure nothing else on the site already serves
`/api/check`.

## Local development

Development origins (like `http://localhost:5173`) are kept out of `wrangler.jsonc` so they
never reach production. Put them in `.dev.vars` instead. That file is gitignored, only
`wrangler dev` reads it, and its values override `wrangler.jsonc` locally:

```bash
cp .dev.vars.example .dev.vars
npx wrangler dev
curl -X POST http://localhost:8787/check -H 'Content-Type: application/json' \
  -d '{"countryCode":"BE","taxId":"BE0417497106"}'
```

If `API_TOKEN` is set locally, add `-H 'Authorization: Bearer <token>'` to the curl call.

For stronger abuse protection than a shared secret, put [Turnstile](https://developers.cloudflare.com/turnstile/) in front of `/check`.
