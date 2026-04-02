import axios from 'axios';


function validate_fr_nif(nif: string, debug: boolean = false): boolean {
    // French NIF: format "0X XX XXX XXX XXX" (13 digits with spaces)
    const value = nif.replace(/\s/g, '');

    if (value.length !== 13) {
        if (debug) { console.log("Invalid length"); }
        return false;
    }
    if (!/^\d+$/.test(value)) {
        if (debug) { console.log("Invalid format"); }
        return false;
    }

    // First digit should be 0-3
    if (!'0123'.includes(value[0])) {
        if (debug) { console.log("Invalid component"); }
        return false;
    }

    return true;
}

function validate_fr_vat(vat: string, debug: boolean = false): boolean {
    // French VAT: FR + 2 check digits (digits or letters) + 9-digit SIREN
    const value = vat.replace(/\s/g, '').toUpperCase();

    let numPart;
    if (value.startsWith('FR')) {
        numPart = value.substring(2);
    } else {
        numPart = value;
    }

    if (numPart.length !== 11) {
        if (debug) { console.log("Invalid length"); }
        return false;
    }

    const siren = numPart.substring(2);
    if (!/^\d{9}$/.test(siren)) {
        if (debug) { console.log("Invalid SIREN component"); }
        return false;
    }

    const checkStr = numPart.substring(0, 2);

    // Check digits can be two digits, or letter+digit, or digit+letter
    if (/^\d{2}$/.test(checkStr)) {
        // Numeric check: key = (12 + 3 * (SIREN % 97)) % 97
        const sirenNum = parseInt(siren, 10);
        const expectedKey = (12 + 3 * (sirenNum % 97)) % 97;
        if (parseInt(checkStr, 10) !== expectedKey) {
            if (debug) { console.log("Invalid checksum"); }
            return false;
        }
    }
    // If check digits contain letters (old format), we can't easily verify — accept regex match

    return true;
}

async function online_check(tin: string, debug: boolean = false): Promise<boolean> {
    // Extract the relevant portion of the TIN (excluding the msCode)
    const processedTin = tin.substring(2);

    try {
        const response = await axios.post('https://ec.europa.eu/taxation_customs/tin/rest-api/tinRequest', {
            msCode: 'FR',
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
    return false;
}

export { validate_fr_nif, validate_fr_vat, online_check };
