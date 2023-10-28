# corporate-taxid-checker-js Node.js sample

This document provides step-by-step instructions on how to use the `corporate-taxid-checker-js` library in a Node.js environment.

## Table of Contents

-   [Setting Up](#setting-up)
-   [Integrating the Library](#integrating-the-library)
-   [Validating Tax ID](#validating-tax-id)
-   [Error Handling](#error-handling)
-   [Additional Notes](#additional-notes)

## Setting Up

1.  **Install Node.js**: Ensure you have Node.js installed. If not, you can download and install it from [nodejs.org](https://nodejs.org/).
    
2.  **Initialize a Node.js project** (if you haven't already):
    
    bashCopy code
    
    `npm init -y` 
    
3.  **Install the `corporate-taxid-checker-js` library**:
    
    bashCopy code
    
    `npm install corporate-taxid-checker-js` 
    

## Integrating the Library

1.  **Import the library** in your Node.js script:
    
    javascriptCopy code
    
    `const validateTaxId = require('corporate-taxid-checker-js');` 
    

## Validating Tax ID

1.  **Validate Tax ID** for a specific country:
    
    javascriptCopy code
    
    `const countryCode = 'SG';
    const taxId = '202018854C';
    const onlineCheck = false; // Set to true for online validation
    
    const validationResult = await validateTaxId(countryCode, taxId, onlineCheck);
    console.log(validationResult);` 
    

## Error Handling

Each method returns a promise. Handle errors using try/catch:

javascriptCopy code

`try {
    const validationResult = await validateTaxId(countryCode, taxId, onlineCheck);
    console.log(validationResult);
} catch (error) {
    console.error('Failed to validate Tax ID:', error.message);
}` 

## Additional Notes

-   The library validates corporate tax IDs based on the provided country codes.
-   Ensure the country codes and tax IDs are valid and in the expected format.
-   For any issues or further documentation, refer to the main `README.md` of the `corporate-taxid-checker-js` library.

----------

With the library now published on npm, users can simply install it using `npm install` as indicated in the README. This should make it easier for users to get started with your library in a Node.js environment.