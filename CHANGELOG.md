# Changelog

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
