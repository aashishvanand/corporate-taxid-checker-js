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
npm install taxid-validator
```

## Usage

The tool can be used by importing the main validator function and then calling it with the appropriate parameters.

Here's a basic example:

```javascript
const { validateTaxId } = require('taxid-validator');

const taxId = '1234567890';
const countryCode = 'IN'; // Use the appropriate country code

const result = validateTaxId(taxId, countryCode);
console.log(result); // logs true if valid, false if invalid
```

## Supported Countries and TINs

The `Tax ID Validator` currently supports tax identification number validation for the following countries:

- Andorra
- United Arab Emirates
- Albania
- Armenia
- Argentina
- Austria
- Australia
- Bangladesh
- Belgium
- Bulgaria
- Bolivia
- Brazil
- Canada
- Switzerland
- Chile
- China
- Colombia
- Costa Rica
- Cyprus
- Czech Republic
- Germany
- Denmark
- Dominican Republic
- Ecuador
- Estonia
- Egypt
- Spain
- European Union
- Finland
- France
- United Kingdom
- Georgia
- Ghana
- Greece
- Hong Kong
- Croatia
- Hungary
- Indonesia
- Ireland
- Israel
- India
- Iceland
- Italy
- Japan
- Kenya
- Cambodia
- South Korea
- Liechtenstein
- Lithuania
- Luxembourg
- Latvia
- Malta
- Mexico
- Malaysia
- Nigeria
- Netherlands
- Norway
- New Zealand
- Peru
- Philippines
- Poland
- Portugal
- Romania
- Serbia
- Russia
- Rwanda
- Saudi Arabia
- Sweden
- Singapore
- Slovenia
- Slovakia
- El Salvador
- Thailand
- Turkey
- Taiwan
- Ukraine
- United States
- Uruguay
- Venezuela
- Vietnam
- South Africa

## Testing

To run the included tests:

```bash
npm run test
```

## Contributing

Contributions are welcome. Please fork the repository and submit a pull request with your changes. Ensure that your PR includes detailed information about the changes, including any new dependencies, environment variables, or required context.

## License
This project is licensed under the Creative Commons Attribution 4.0 International (CC BY 4.0) - see the LICENSE file for details.