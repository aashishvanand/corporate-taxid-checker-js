# Online-check proxy Worker

Browsers can't call VIES or ABN Lookup directly (neither sends CORS headers). This Cloudflare
Worker sits in between for the demo site. It reuses `src/online.ts` from the library, so the
Worker and the npm package always use the same registry logic.

```
browser ──POST /check {countryCode, taxId}──▶ Worker ──▶ VIES / ABN Lookup
        ◀── { status, provider, details } ───        (edge-cached)
```

What keeps it safe and cheap:

- **Not an open proxy:** it accepts only `{ countryCode, taxId }` with a strict character set, only for countries that have a registry, and only calls the fixed registry URLs.
- **CORS allowlist:** only origins in `ALLOWED_ORIGINS` can read responses from a browser.
- **Per-IP rate limit:** 20 requests a minute through the Workers Rate Limiting binding, which also stops the Worker's egress IPs from being throttled by VIES.
- **Edge cache:** `valid` results are cached for 24 h and `invalid` for 1 h. `unavailable` is never cached, so a registry outage clears up on its own.

## Deploy

```bash
cd worker
npm install
# set ALLOWED_ORIGINS in wrangler.jsonc to your demo's origin(s)
npx wrangler secret put ABR_GUID   # optional, enables Australian ABN checks
npx wrangler deploy
```

Then, in the demo:

```javascript
validateTaxId(country, taxId, { online: true, endpoint: 'https://taxid-online-check.<account>.workers.dev/check' });
```

## Local development

```bash
npx wrangler dev
curl -X POST http://localhost:8787/check -H 'Content-Type: application/json' \
  -d '{"countryCode":"BE","taxId":"BE0417497106"}'
```

If the demo is public and gets abused, add [Turnstile](https://developers.cloudflare.com/turnstile/) in front of `/check`.
