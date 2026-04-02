# corporate-taxid-checker-js

Validate corporate tax identification numbers (TINs) across **131 countries** with three levels of verification: regex format checks, checksum algorithms, and online authority lookups.

## Features

- **131 countries** with regex format validation
- **60+ countries** with checksum verification (Luhn, MOD-97, ISO 7064, weighted sums, and more)
- **24 countries** with online authority lookup (EU TIN API, Australian ABR)
- Works in Node.js and browsers (UMD bundle)
- **Bulk validation** — validate multiple tax IDs in one call
- **Helper utilities** — check supported countries and tax ID types
- Zero-config — just call `validateTaxId(countryCode, taxId)`

## Requirements

- Node.js >= 18.0.0

## Installation

```bash
npm install corporate-taxid-checker-js
```

## Usage

```javascript
const { validateTaxId, validateTaxIds, getSupportedCountries, isCountrySupported, getTaxIdInfo } = require('corporate-taxid-checker-js');

// Basic validation (regex + checksum)
const result = await validateTaxId('IN', '36AAGCG6803L1ZD');
console.log(result);
// {
//   isValid: true,
//   regexValid: true,
//   checkSumCheckPresent: true,
//   checkSum: true,
//   onlineCheckPresent: false,
//   onlineCheck: false
// }

// With online authority check (for supported countries)
const result2 = await validateTaxId('AT', 'ATU62123456', true);
console.log(result2);
// {
//   isValid: true/false,
//   regexValid: true,
//   checkSumCheckPresent: true,
//   checkSum: true/false,
//   onlineCheckPresent: true,
//   onlineCheck: true/false
// }
```

### Bulk Validation

Validate multiple tax IDs in a single call. All validations run in parallel.

```javascript
const results = await validateTaxIds([
    { countryCode: 'US', taxId: '94-1577458' },
    { countryCode: 'IN', taxId: '36AAGCG6803L1ZD' },
    { countryCode: 'DE', taxId: '123456789' },
]);
// Returns: [{ countryCode, taxId, result }, ...]
```

### Helper Utilities

```javascript
// Get all supported country codes
const countries = getSupportedCountries();
// ['AD', 'AE', 'AG', ..., 'ZA']

// Check if a country is supported
isCountrySupported('US'); // true
isCountrySupported('XX'); // false

// Get tax ID types for a country
const info = getTaxIdInfo('IN');
// [{ label: 'GSTIN', type: 'GSTIN', hasChecksum: true, hasOnlineCheck: false }, ...]
```

### API Reference

#### `validateTaxId(countryCode, taxId, onlineCheckRequired?, debug?)`

| Parameter | Type | Default | Description |
|---|---|---|---|
| `countryCode` | string | required | ISO 3166-1 alpha-2 country code (case-insensitive) |
| `taxId` | string | required | The tax ID to validate |
| `onlineCheckRequired` | boolean | `false` | Whether to perform online authority lookup |
| `debug` | boolean | `false` | Enable debug logging to console |

Returns `TaxIdValidationResult`:

| Field | Type | Description |
|---|---|---|
| `isValid` | boolean | Overall validation result |
| `regexValid` | boolean | Whether the format matches the expected pattern |
| `checkSumCheckPresent` | boolean | Whether checksum validation is available for this tax ID type |
| `checkSum` | boolean | Checksum validation result |
| `onlineCheckPresent` | boolean | Whether online validation is available |
| `onlineCheck` | boolean | Online authority lookup result |

#### `validateTaxIds(items, onlineCheckRequired?, debug?)`

| Parameter | Type | Default | Description |
|---|---|---|---|
| `items` | `Array<{countryCode, taxId}>` | required | Array of tax IDs to validate |
| `onlineCheckRequired` | boolean | `false` | Whether to perform online authority lookup |
| `debug` | boolean | `false` | Enable debug logging to console |

Returns `Array<{ countryCode, taxId, result }>` where `result` is a `TaxIdValidationResult` or an error string.

#### `getSupportedCountries()`

Returns a sorted `string[]` of all supported ISO 3166-1 alpha-2 country codes.

#### `isCountrySupported(countryCode)`

Returns `boolean` — whether the given country code is supported.

#### `getTaxIdInfo(countryCode)`

Returns `TaxIdTypeInfo[]` with `{ label, type, hasChecksum, hasOnlineCheck }` for each tax ID type, or an error string if the country is not supported.

### Validation Levels

1. **Regex Check** — Validates the TIN format against known patterns
2. **Checksum Validation** — Verifies the TIN's check digit using the appropriate algorithm (based on [OECD guidelines](https://www.oecd.org/tax/automatic-exchange/crs-implementation-and-assistance/tax-identification-numbers/))
3. **Online Authority Lookup** — Confirms validity by querying the country's tax authority API (EU countries via the EC TIN API, Australia via ABR)

## Supported Countries

Code | Country | Regex | Checksum | Online
---|---|---|---|---
AD | Andorra | Y | Y |
AE | United Arab Emirates | Y | |
AG | Antigua and Barbuda | Y | |
AI | Anguilla | Y | |
AL | Albania | Y | Y |
AM | Armenia | Y | |
AR | Argentina | Y | Y |
AT | Austria | Y | Y | Y
AU | Australia | Y | Y | Y
AW | Aruba | Y | |
AZ | Azerbaijan | Y | Y |
BB | Barbados | Y | |
BD | Bangladesh | Y | |
BE | Belgium | Y | Y | Y
BG | Bulgaria | Y | Y | Y
BH | Bahrain | Y | |
BO | Bolivia | Y | |
BR | Brazil | Y | Y |
BY | Belarus | Y | Y |
BZ | Belize | Y | Y |
CA | Canada | Y | Y |
CH | Switzerland | Y | Y |
CL | Chile | Y | Y |
CN | China | Y | Y |
CO | Colombia | Y | Y |
CR | Costa Rica | Y | Y |
CU | Cuba | Y | |
CW | Curacao | Y | |
CY | Cyprus | Y | Y | Y
CZ | Czech Republic | Y | Y | Y
DE | Germany | Y | Y | Y
DK | Denmark | Y | Y | Y
DO | Dominican Republic | Y | |
DZ | Algeria | Y | |
EC | Ecuador | Y | Y |
EE | Estonia | Y | Y | Y
EG | Egypt | Y | Y |
ES | Spain | Y | Y | Y
ET | Ethiopia | Y | |
FI | Finland | Y | Y | Y
FO | Faroe Islands | Y | |
FR | France | Y | Y | Y
GB | United Kingdom | Y | Y |
GE | Georgia | Y | |
GG | Guernsey | Y | |
GH | Ghana | Y | Y |
GI | Gibraltar | Y | |
GN | Guinea | Y | Y |
GR | Greece | Y | | Y
GT | Guatemala | Y | Y |
HK | Hong Kong | Y | |
HR | Croatia | Y | Y | Y
HU | Hungary | Y | Y | Y
ID | Indonesia | Y | Y |
IE | Ireland | Y | Y | Y
IL | Israel | Y | Y |
IM | Isle of Man | Y | |
IN | India | Y | Y |
IS | Iceland | Y | |
IT | Italy | Y | | Y
JM | Jamaica | Y | |
JP | Japan | Y | Y |
KE | Kenya | Y | |
KG | Kyrgyzstan | Y | |
KH | Cambodia | Y | |
KN | St. Kitts and Nevis | Y | |
KR | South Korea | Y | Y |
KW | Kuwait | Y | |
KZ | Kazakhstan | Y | |
LB | Lebanon | Y | |
LI | Liechtenstein | Y | |
LK | Sri Lanka | Y | |
LT | Lithuania | Y | | Y
LU | Luxembourg | Y | | Y
LV | Latvia | Y | | Y
MA | Morocco | Y | Y |
MC | Monaco | Y | |
MD | Moldova | Y | |
ME | Montenegro | Y | Y |
MH | Marshall Islands | Y | |
MK | North Macedonia | Y | Y |
MT | Malta | Y | | Y
MU | Mauritius | Y | |
MV | Maldives | Y | |
MX | Mexico | Y | Y |
MY | Malaysia | Y | |
NG | Nigeria | Y | |
NI | Nicaragua | Y | |
NL | Netherlands | Y | Y | Y
NO | Norway | Y | Y |
NP | Nepal | Y | |
NZ | New Zealand | Y | Y |
OM | Oman | Y | |
PA | Panama | Y | |
PE | Peru | Y | Y |
PH | Philippines | Y | |
PK | Pakistan | Y | |
PL | Poland | Y | Y | Y
PT | Portugal | Y | Y | Y
PY | Paraguay | Y | Y |
QA | Qatar | Y | |
RO | Romania | Y | Y | Y
RS | Serbia | Y | Y |
RU | Russia | Y | Y |
RW | Rwanda | Y | |
SA | Saudi Arabia | Y | |
SC | Seychelles | Y | |
SE | Sweden | Y | Y | Y
SG | Singapore | Y | Y |
SI | Slovenia | Y | Y | Y
SK | Slovakia | Y | Y | Y
SM | San Marino | Y | Y |
SV | El Salvador | Y | Y |
SX | Sint Maarten | Y | |
TH | Thailand | Y | Y |
TJ | Tajikistan | Y | |
TM | Turkmenistan | Y | |
TN | Tunisia | Y | Y |
TR | Turkey | Y | Y |
TT | Trinidad and Tobago | Y | |
TW | Taiwan | Y | Y |
TZ | Tanzania | Y | |
UA | Ukraine | Y | Y |
UG | Uganda | Y | |
US | United States | Y | |
UY | Uruguay | Y | Y |
UZ | Uzbekistan | Y | |
VE | Venezuela | Y | Y |
VN | Vietnam | Y | Y |
WS | Samoa | Y | |
ZA | South Africa | Y | Y |

## v2.0.0 Breaking Changes

- **`onlineCheckPresent`** — The return field was previously misspelled as `onnlineCheckPresent`. Update your code if you reference this field.
- **`debug` default changed** — The `debug` parameter now defaults to `false` (was `true`). Pass `true` explicitly if you need console logging.
- **Node.js >= 18** — Dropped support for Node.js 14 and 16.

## Testing

```bash
npm run build
npm test
```

280 tests covering all 131 supported countries plus utility functions.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes. Areas where help is especially appreciated:

- Adding checksum validation for countries that currently only have regex
- Improving regex patterns to better match official formats
- Adding online validation endpoints for non-EU countries
- Adding new countries

## License

This project is dual-licensed:

### Open Source — GPLv3

This project is licensed under the [GNU General Public License v3.0 or later](LICENSE) for open-source use. You are free to use, modify, and distribute this software under the terms of the GPLv3, which requires that any derivative works or projects incorporating this library also be open-sourced under the same license.

### Commercial License

If you wish to use this library in a **closed-source, proprietary, or commercial product** without the obligations of the GPLv3, a commercial license is available.

To obtain a commercial license, please contact: **aashish@aashishvanand.me** with your proposal.
