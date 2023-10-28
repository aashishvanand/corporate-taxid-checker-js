# Tax ID Validator

## Overview

`Tax ID Validator` is a robust tool designed for validating various tax identification numbers (TINs), such as GSTIN in India, UEN in Singapore, etc. The tool uses regular expressions and specific validation logic for each type of TIN, ensuring that the input adheres to the expected format and structural rules of the respective issuing authority.

## Features

- Supports multiple countries and TIN types.
- Uses precise regular expressions for format validation.
- Implements checksum logic for countries that incorporate checksum characters in their TINs.
- Easy to integrate and use in various JavaScript environments.

## Requirements

- Node.js (v14 or newer recommended)

## Installation

You can install the package via npm:

```bash
npm install corporate-taxid-checker-js
```

## Usage

The tool can be used by importing the main validator function and then calling it with the appropriate parameters.

Here's a basic example:

```javascript
const { validateTaxId } = require('corporate-taxid-checker-js');

const taxId = '1234567890';
const countryCode = 'IN'; // Use the appropriate country code

const result = validateTaxId(taxId, countryCode);
console.log(result); // logs true if valid, false if invalid
```
### Validation Levels

For enhanced accuracy and reliability, our tool offers three levels of TIN validation for several countries:

1.  **Regex Check:** This initial check ensures the TIN adheres to the expected format using precise regular expressions.
2.  **Checksum Validation:** Based on the guidelines from the [OECD](https://www.oecd.org/tax/automatic-exchange/crs-implementation-and-assistance/tax-identification-numbers/), this check verifies the integrity of the TIN using its checksum.
3.  **Authority Lookup (Available for EU countries and Australia):** This advanced check confirms the validity of the TIN by directly querying the respective country's tax authority website.

## Supported Countries and TINs

The `Tax ID Validator` currently supports tax identification number validation for the following countries:

Country Code | Country | Regex Check | Checksum Check | Online Check
---|---|---|---|---
AD | Andorra | ✅ | ✅ | 
AE | United Arab Emirates | ✅ |  | 
AL | Albania | ✅ | ✅ | 
AM | Armenia | ✅ |  | 
AR | Argentina | ✅ | ✅ | 
AT | Austria | ✅ | ✅ | 
AU | Australia | ✅ | ✅ | 
AZ | Azerbaijan |  | ✅ | 
BD | Bangladesh | ✅ |  | 
BE | Belgium | ✅ | ✅ | 
BG | Bulgaria | ✅ | ✅ | 
BO | Bolivia | ✅ |  | 
BR | Brazil | ✅ | ✅ | 
BY | Belarus |  | ✅ | 
BZ | Belize | ✅ | ✅ | 
CA | Canada | ✅ | ✅ | 
CH | Switzerland | ✅ | ✅ | 
CL | Chile | ✅ | ✅ | 
CN | China | ✅ | ✅ | 
CO | Colombia | ✅ | ✅ | 
CR | Costa Rica | ✅ | ✅ | 
CY | Cyprus | ✅ | ✅ | 
CZ | Czech Republic | ✅ | ✅ | 
DE | Germany | ✅ | ✅ | 
DK | Denmark | ✅ | ✅ | 
DO | Dominican Republic | ✅ |  | 
DZ | Algeria | ✅ |  | 
EC | Ecuador | ✅ | ✅ | 
EE | Estonia | ✅ | ✅ | 
EG | Egypt | ✅ | ✅ | 
ES | Spain | ✅ | ✅ | 
FI | Finland | ✅ | ✅ | 
FR | France | ✅ | ✅ | 
FO | Faroe Islands | ✅ |  | 
GB | United Kingdom | ✅ |  | 
GE | Georgia | ✅ |  | 
GH | Ghana | ✅ | ✅ | 
GN | Guinea | ✅ | ✅ | 
GR | Greece | ✅ |  | 
GT | Guatemala | ✅ | ✅ | 
HK | Hong Kong | ✅ |  | 
HR | Croatia | ✅ |  | 
HU | Hungary | ✅ | ✅ | 
ID | Indonesia | ✅ | ✅ | 
IE | Ireland | ✅ | ✅ | 
IL | Israel | ✅ | ✅ | 
IN | India | ✅ | ✅ | 
IS | Iceland | ✅ |  | 
IT | Italy | ✅ |  | 
JP | Japan | ✅ | ✅ | 
KE | Kenya | ✅ |  | 
KH | Cambodia | ✅ |  | 
KR | South Korea | ✅ | ✅ | 
LI | Liechtenstein | ✅ |  | 
LT | Lithuania | ✅ |  | 
LU | Luxembourg | ✅ |  | 
LV | Latvia | ✅ |  | 
MA | Morocco | ✅ | ✅ | 
FR | Monaco | ✅ |  | 
MD | Moldova | ✅ |  | 
ME | Montenegro | ✅ | ✅ | 
MK | North Macedonia |  | ✅ | 
MT | Malta | ✅ |  | 
MX | Mexico | ✅ | ✅ | 
MY | Malaysia | ✅ |  | 
NG | Nigeria | ✅ |  | 
NL | Netherlands | ✅ | ✅ | 
NO | Norway | ✅ | ✅ | 
NZ | New Zealand | ✅ | ✅ | 
PE | Peru | ✅ | ✅ | 
PH | Philippines | ✅ |  | 
PL | Poland | ✅ | ✅ | 
PT | Portugal | ✅ | ✅ | 
PY | Paraguay | ✅ | ✅ | 
RO | Romania | ✅ | ✅ | 
RS | Serbia | ✅ | ✅ | 
RU | Russia | ✅ | ✅ | 
RW | Rwanda | ✅ |  | 
SA | Saudi Arabia | ✅ |  | 
SE | Sweden | ✅ | ✅ | 
SG | Singapore | ✅ | ✅ | 
SI | Slovenia | ✅ | ✅ | 
SK | Slovakia | ✅ | ✅ | 
SM | San Marino | ✅ | ✅ | 
SV | El Salvador | ✅ | ✅ | 
TH | Thailand | ✅ | ✅ | 
TN | Tunisia | ✅ | ✅ | 
TR | Turkey | ✅ | ✅ | 
TW | Taiwan | ✅ | ✅ | 
UA | Ukraine | ✅ | ✅ | 
US | United States | ✅ |  | 
UY | Uruguay | ✅ | ✅ | 
VE | Venezuela | ✅ | ✅ | 
VN | Vietnam | ✅ | ✅ | 
ZA | South Africa | ✅ | ✅ | 
AD | Andorra | ✅ | ✅ | 
AE | United Arab Emirates | ✅ |  | 
AL | Albania | ✅ | ✅ | 
AM | Armenia | ✅ |  | 
AR | Argentina | ✅ | ✅ | 
AT | Austria | ✅ | ✅ | ✅
AU | Australia | ✅ | ✅ | ✅
AZ | Azerbaijan |  | ✅ | 
BD | Bangladesh | ✅ |  | 
BE | Belgium | ✅ | ✅ | ✅
BG | Bulgaria | ✅ | ✅ | ✅
BO | Bolivia | ✅ |  | 
BR | Brazil | ✅ | ✅ | 
BY | Belarus |  | ✅ | 
BZ | Belize | ✅ | ✅ | 
CA | Canada | ✅ | ✅ | 
CH | Switzerland | ✅ | ✅ | 
CL | Chile | ✅ | ✅ | 
CN | China | ✅ | ✅ | 
CO | Colombia | ✅ | ✅ | 
CR | Costa Rica | ✅ | ✅ | 
CY | Cyprus | ✅ | ✅ | ✅
CZ | Czech Republic | ✅ | ✅ | ✅
DE | Germany | ✅ | ✅ | ✅
DK | Denmark | ✅ | ✅ | ✅
DO | Dominican Republic | ✅ |  | 
DZ | Algeria | ✅ |  | 
EC | Ecuador | ✅ | ✅ | 
EE | Estonia | ✅ | ✅ | ✅
EG | Egypt | ✅ | ✅ | 
ES | Spain | ✅ | ✅ | ✅
FI | Finland | ✅ | ✅ | ✅
FR | France | ✅ | ✅ | 
FO | Faroe Islands | ✅ |  | 
GB | United Kingdom | ✅ |  | 
GE | Georgia | ✅ |  | 
GH | Ghana | ✅ | ✅ | 
GN | Guinea | ✅ | ✅ | 
GR | Greece | ✅ |  | ✅
GT | Guatemala | ✅ | ✅ | 
HK | Hong Kong | ✅ |  | 
HR | Croatia | ✅ |  | ✅
HU | Hungary | ✅ | ✅ | ✅
ID | Indonesia | ✅ | ✅ | 
IE | Ireland | ✅ | ✅ | ✅
IL | Israel | ✅ | ✅ | 
IN | India | ✅ | ✅ | 
IS | Iceland | ✅ |  | 
IT | Italy | ✅ |  | ✅
JP | Japan | ✅ | ✅ | 
KE | Kenya | ✅ |  | 
KH | Cambodia | ✅ |  | 
KR | South Korea | ✅ | ✅ | 
LI | Liechtenstein | ✅ |  | 
LT | Lithuania | ✅ |  | ✅
LU | Luxembourg | ✅ |  | ✅
LV | Latvia | ✅ |  | ✅
MA | Morocco | ✅ | ✅ | 
FR | Monaco | ✅ |  | 
MD | Moldova | ✅ |  | 
ME | Montenegro | ✅ | ✅ | 
MK | North Macedonia |  | ✅ | 
MT | Malta | ✅ |  | ✅
MX | Mexico | ✅ | ✅ | 
MY | Malaysia | ✅ |  | 
NG | Nigeria | ✅ |  | 
NL | Netherlands | ✅ | ✅ | ✅
NO | Norway | ✅ | ✅ | 
NZ | New Zealand | ✅ | ✅ | 
PE | Peru | ✅ | ✅ | 
PH | Philippines | ✅ |  | 
PL | Poland | ✅ | ✅ | ✅
PT | Portugal | ✅ | ✅ | ✅
PY | Paraguay | ✅ | ✅ | 
RO | Romania | ✅ | ✅ | ✅
RS | Serbia | ✅ | ✅ | 
RU | Russia | ✅ | ✅ | 
RW | Rwanda | ✅ |  | 
SA | Saudi Arabia | ✅ |  | 
SE | Sweden | ✅ | ✅ | ✅
SG | Singapore | ✅ | ✅ | 
SI | Slovenia | ✅ | ✅ | ✅
SK | Slovakia | ✅ | ✅ | ✅
SM | San Marino | ✅ | ✅ | 
SV | El Salvador | ✅ | ✅ | 
TH | Thailand | ✅ | ✅ | 
TN | Tunisia | ✅ | ✅ | 
TR | Turkey | ✅ | ✅ | 
TW | Taiwan | ✅ | ✅ | 
UA | Ukraine | ✅ | ✅ | 
US | United States | ✅ |  | 
UY | Uruguay | ✅ | ✅ | 
VE | Venezuela | ✅ | ✅ | 
VN | Vietnam | ✅ | ✅ | 
ZA | South Africa | ✅ | ✅ | 

## Testing

To run the included tests:

```bash
npm run test
```

## Contributing

Contributions are welcome. Please fork the repository and submit a pull request with your changes. Ensure that your PR includes detailed information about the changes, including any new dependencies, environment variables, or required context.

## License
This project is licensed under the Creative Commons Attribution 4.0 International (CC BY 4.0) - see the LICENSE file for details.