
function validate_es_cif(es, debug=false) {

    // Entity types and corresponding check digits
    const entityTypes = 'ABCDEFGHJNPQRSUVW';
    const letterCheckDigits = 'JABCDEFGHI';

    // Helper function to calculate Luhn's algorithm checksum digit
    function luhnChecksumDigit(num) {
        let sum = 0;
        let alt = true;
        for (let i = num.length - 1; i >= 0; i--) {
            let n = parseInt(num.charAt(i), 10);
            if (isNaN(n)) return null;
            if (alt) {
                n *= 2;
                if (n >= 10) n -= 9;
            }
            sum += n;
            alt = !alt;
        }
        return sum % 10;
    }

    // Assuming cif is already cleaned and in the correct format
    // and that the length check has been done outside this function

    const [first, body, check] = [cif.charAt(0), cif.slice(1, -1), cif.slice(-1)];

    if (!/^\d+$/.test(body) || !entityTypes.includes(first) || !(/^\d$/.test(check) || letterCheckDigits.includes(check))) {
        if (debug) { 
            console.log("Invalid component");
        }
        return false;
    }

    const cs = luhnChecksumDigit(body);
    if (cs === null) {
        if (debug) { 
            console.log("Invalid checksum calculation");
        }
        return false;
    }

    // Two systems of check digits
    const possibleCheckDigits = letterCheckDigits[cs] + String(cs);

    if (!possibleCheckDigits.includes(check)) {
        if (debug) { 
            console.log("Invalid checksum");
        }
        return false;
    }

    // If the CIF passes all checks
    return true;
}

function validate_es_vat(es, debug=false) {
    var debug = false; // Debug flag

    // Helper function to calculate DNI check digit
    function calcDniCheckDigit(num) {
        const letterValues = "TRWAGMYFPDXBNJZSQVHLCKE";
        const mod = parseInt(num, 10) % 23;
        return letterValues.charAt(mod);
    }

    // Assuming vat is already cleaned and in the correct format
    // and that the length check has been done outside this function

    if ('KLM'.includes(vat[0])) {
        // K: Spanish younger than 14 years old
        // L: Spanish living outside Spain without DNI
        // M: Granted the tax to foreigners who have no NIE
        // These use the old check digit algorithm (the DNI one)
        if (vat[vat.length - 1] !== calcDniCheckDigit(vat.substr(1))) {
            if (debug) { 
                console.log("Invalid checksum");
            }
            return false;
        }
        return true;
    }
    if (/^\d$/.test(vat[0])) {
        // Natural resident (DNI)
        // Assuming a separate DNI validation function is available
        return validate_dni(vat); // Placeholder for actual DNI validation
    }
    if ('XYZ'.includes(vat[0])) {
        // Foreign natural person (NIE)
        // Assuming a separate NIE validation function is available
        return validate_nie(vat); // Placeholder for actual NIE validation
    }

    // Otherwise, it has to be a CIF
    // Assuming a separate CIF validation function is available
    return validate_cif(vat); // Placeholder for actual CIF validation
}

async function online_check(tin,debug=false) {
    const axios = require('axios');
    
    // Extract the relevant portion of the TIN (excluding the msCode)
    const processedTin = tin.substring(2);
    
    try {
        const response = await axios.post('https://ec.europa.eu/taxation_customs/tin/rest-api/tinRequest', {
            msCode: 'ES',
            tinNumber: processedTin
        });

        if (response.status !== 200) {
            if (debug) console.log(`Request failed with status: ${response.status}`);
            return false;
        }

        const data = response.data;
        if (data.result.structureValid === true && data.result.syntaxValid === true) {
            return true;
        }

        if (data.result.userError !== "0" || data.result.error === true || data.result.structureValid === false || data.result.syntaxValid === false) {
            if (debug) {
                console.log('Response Data:', data.result);
                if (data.result.userError !== "0") console.log(`User Error with code: ${data.result.userError}`);
                if (data.result.error === true) console.log('Error flag set to true in response');
                if (data.result.structureValid === false) console.log('Structure validity check failed');
                if (data.result.syntaxValid === false) console.log('Syntax validity check failed');
            }
            return false;
        }
    } catch (error) {
        if (debug) console.log('Axios request error:', error);
        console.error(error);
        return false;
    }
}

module.exports = { validate_es_cif, validate_es_vat, online_check };
