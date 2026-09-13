# Changelog

## [2.2.0] - 2026-09-13

### New Features

- **5 new countries** — Brunei Darussalam (BN), Côte d'Ivoire (CI), Myanmar (MM), Mongolia (MN), and Namibia (NA), sourced from OECD TIN documentation and official tax authority guidance. Expanded from 145 to 150 supported countries.
- **Swedish TIN corrected** — Sweden previously only exposed a VAT-number check under the generic TIN entry. Added the actual TIN (personnummer / samordningsnummer / organisationsnummer per the OECD spec), keeping VAT validation available separately (`se_vat`).
- **New tax ID types for existing countries**, found by cross-checking every entry against Stripe's published tax-ID reference and OECD source documents:
  - Croatia (`hr_oib`) and Poland (`pl_nip`) now accept the bare domestic form, not just the EU-VAT-prefixed one.
  - Italy: added Codice Fiscale (`it_cf`).
  - Nigeria (`ng_tin`): added the JTB 10-digit format alongside the existing FIRS 8-hyphen-4 format.
  - Sri Lanka: added VAT registration number (`lk_vat`).
  - Armenia: added the general 8-digit TIN (`am_tin`).
  - Uzbekistan: corrected the mislabeled 9-digit `uz_vat` to `uz_tin`, and added the real 12-digit `uz_vat`.
  - Faroe Islands: replaced a format with no basis in any source with the real P-number (individual) and V-number (business) formats.

### Bug Fixes

- **Fixed a two-part bug in the shared Luhn checksum helper** (`luhnChecksumValidate`) — an operator-precedence error and a mod-9 shortcut that conflated digit `0` with `9` — that silently mis-validated checksums for Canada, Guinea, Indonesia, South Africa, and Sweden (VAT) whenever certain digits landed in a doubled position.
- **Fixed checksum-unreachable formats** in Guinea, Indonesia, and Hungary, where the regex accepted separators (hyphens/dots) that the checksum function then rejected outright, so valid IDs in that form could never pass.
- **Fixed online-check prefix corruption** in Austria, Germany, Spain, Croatia, Hungary, Poland, and Sweden — `online_check` unconditionally stripped a 2-character country-code prefix before querying the EU VIES endpoint, corrupting input for any format that also allows a bare/domestic (unprefixed) form.
- **Removed a semantic bug** where Germany's domestic Steuernummer (`de_stnr`) was marked as online-checkable even though it isn't an EU VAT number and can never be verified via VIES.

### Performance

- **Removed the `jsonpack` dependency** — country/type data is now imported directly as JSON (`src/data.json`) instead of being packed at build time and unpacked at every module load. One less dependency, no runtime decompression cost.
- **Removed the unused `data/data.compressed` artifact** — it was written by the build script but never read by anything; `data/data.json` is now the single source of truth, copied into `src/` for bundling.

### Testing

- **New `tests/validators/onlineCheck.test.ts`** — a data-driven suite (with axios mocked) that locks in the exact `{ msCode, tinNumber }` payload sent to the VIES endpoint for all 26 EU-VAT-style validators with online checks, covering both prefixed and bare-domestic input where applicable. This is the regression guard for the online-check prefix bug above.
- Added real, checksum-verified test cases (not just regex-shape checks) for every country touched by the Luhn fix and the new/corrected formats above.
- **502 tests**, up from 280.

## [2.1.0] - 2026-09-10

### Infrastructure

- **Migrated build and test tooling to SWC** — replaced `ts-loader`/`ts-jest` with `swc-loader`/`@swc/jest` across all four webpack configs and the Jest config for faster builds and test runs.

## [2.0.0] - 2026-04-02

### Breaking Changes

- **Full TypeScript rewrite** — All source files migrated from JavaScript to TypeScript. Consumers importing internal file paths will need to update.
- **Renamed `onnlineCheckPresent` to `onlineCheckPresent`** — Fixed typo in the validation result field. Update any code referencing the old name.
- **`debug` parameter defaults to `false`** — Was `true` in v1. Pass `true` explicitly if you need console logging.
- **`main` entry point changed** — Now points to `lib/index.js` (CJS). Browser bundle available via the `browser` field.
- **Node.js >= 18 required** — Dropped support for Node.js 14 and 16.
- **`cheerio` moved to `optionalDependencies`** — Online check features degrade gracefully if cheerio is not installed.
- **Babel removed** — Replaced entirely by TypeScript (`ts-loader`, `ts-jest`).
- **`.npmignore` replaced** — Now using explicit `"files"` array in `package.json`.

### New Features

- **51 new countries** — Expanded from 94 to 145 supported countries: AG, AI, AO, AW, BA, BB, BF, BH, BJ, BS, CD, CM, CU, CV, CW, ET, GG, GI, IM, JM, KG, KN, KW, KZ, LA, LB, LK, MC, MH, MR, MU, MV, NI, NP, OM, PA, PK, QA, SC, SN, SR, SX, TJ, TM, TT, TZ, UG, UZ, WS, ZM, ZW.
- **Bulk validation** — New `validateTaxIds()` function to validate multiple tax IDs in a single call with parallel execution.
- **Helper utilities** — New `getSupportedCountries()`, `isCountrySupported()`, and `getTaxIdInfo()` functions.
- **Input utilities** — New `sanitize()` for cleaning user input and `maskTaxId()` for display masking.
- **Shared checksum helpers** — Reusable `weightedSum()`, `luhnChecksumValidate()`, and `clean()` utilities.
- **Territory alias support** — Overseas territories automatically map to parent country validation (e.g., GF/GP/MQ/RE -> FR, JE -> GB, AX -> FI).
- **Enriched result object** — Validation results now include `matchedType` and `matchedLabel` fields.
- **TypeScript declarations** — Full type definitions shipped (`types/index.d.ts`, `types/utils.d.ts`).
- **ESM module output** — New `esm/index.mjs` build with proper conditional exports via `package.json` exports map.

### Bug Fixes

- **Country-code prefix stripping** — Tax IDs with ISO country-code prefixes (e.g., `ATU62123456`) now have the prefix stripped before checksum validation.
- **`compressJson.js` path resolution** — Fixed relative paths to use `path.join(__dirname, ...)` for correct execution from any directory.
- **`compressJson.js` log message** — Fixed copy-paste error that referenced `airports.compressed`.
- **`localTest.js` import path** — Fixed to use built output (`lib/index.js`) instead of source.
- **Removed `fs-extra` dependency** — Replaced with Node.js built-in `fs` and `path`.
- **Duplicate France entry** — Deduplicated `FR` entry in data.json.

### Performance

- **O(1) country lookup** — Replaced `Array.find()` with a pre-built `Map` keyed by ISO country code.
- **Regex compilation cache** — `RegExp` objects compiled once and cached instead of re-created per call.
- **Validator module cache** — Country validators loaded once and cached instead of re-imported per call.
- **Webpack externals** — `axios`, `cheerio`, and `jsonpack` externalized in all webpack configs to reduce bundle size.

### Infrastructure

- **Triple output targets** — CJS (`lib/`), UMD (`dist/`), and ESM (`esm/`) builds.
- **Package.json conditional exports** — Proper `exports` map for `types`, `import`, `require`, and `default`.
- **CI/CD overhaul** — Separated build/test from publish, updated to `actions/checkout@v4` and `actions/setup-node@v4`, added `--provenance` for supply-chain attestation.
- **New `typecheck` script** — `npm run typecheck` runs `tsc --noEmit`.
- **GitHub Actions environment** — Publish job uses `environment: release` with OIDC permissions.

### Testing

- **Comprehensive test suite** — Expanded from ~63 lines to ~2,400 lines covering all 145 countries with valid/invalid cases.
- **280 tests** — Full coverage of all validators, bulk validation, helper utilities, and input sanitization.
- **Jest config updated** — Switched from `babel-jest` to `ts-jest` with custom raw transform for `.compressed` files.

## [1.0.0] - 2023-11-14

- Initial release with 94 country validators, regex and checksum validation, and online authority lookup support.
