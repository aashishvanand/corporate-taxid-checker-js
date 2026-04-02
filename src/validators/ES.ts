import axios from 'axios';


function validate_es_cif(cif: string, debug: boolean = false): boolean {

    // Entity types and corresponding check digits
    const entityTypes = 'ABCDEFGHJNPQRSUVW';
    const letterCheckDigits = 'JABCDEFGHI';

    // Helper function to calculate Luhn's algorithm checksum digit
    function luhnChecksumDigit(num: string) {
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

function validate_es_vat(es: string, debug: boolean = false): boolean {
    const letterValues = "TRWAGMYFPDXBNJZSQVHLCKE";

    // Helper function to calculate DNI check digit
    function calcDniCheckDigit(num: string) {
        const mod = parseInt(num, 10) % 23;
        return letterValues.charAt(mod);
    }

    if ('KLM'.includes(es[0])) {
        // K: Spanish younger than 14 years old
        // L: Spanish living outside Spain without DNI
        // M: Granted the tax to foreigners who have no NIE
        if (es[es.length - 1] !== calcDniCheckDigit(es.substr(1))) {
            if (debug) {
                console.log("Invalid checksum");
            }
            return false;
        }
        return true;
    }
    if (/^\d$/.test(es[0])) {
        // Natural resident (DNI) — 8 digits + check letter
        const num = es.slice(0, -1);
        const check = es.slice(-1);
        if (check !== calcDniCheckDigit(num)) {
            if (debug) { console.log("Invalid DNI checksum"); }
            return false;
        }
        return true;
    }
    if ('XYZ'.includes(es[0])) {
        // Foreign natural person (NIE) — replace X/Y/Z with 0/1/2
        const nieMap: Record<string, string> = { X: '0', Y: '1', Z: '2' };
        const num = nieMap[es[0]] + es.slice(1, -1);
        const check = es.slice(-1);
        if (check !== calcDniCheckDigit(num)) {
            if (debug) { console.log("Invalid NIE checksum"); }
            return false;
        }
        return true;
    }

    // Otherwise, it has to be a CIF
    return validate_es_cif(es, debug);
}

async function online_check(tin: string, debug: boolean = false): Promise<boolean> {
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
    return false;
}

export { validate_es_cif, validate_es_vat, online_check };
