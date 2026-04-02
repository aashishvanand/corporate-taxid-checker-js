import axios from 'axios';


function validate_hr_oib(oib: string, debug: boolean = false): boolean {
    const value = oib.replace(/\D/g, '');

    if (value.length !== 11) {
        if (debug) { console.log("Invalid length"); }
        return false;
    }

    if (!/^\d+$/.test(value)) {
        if (debug) { console.log("Invalid format"); }
        return false;
    }

    // ISO 7064 MOD 11,10 algorithm
    let check = 10;
    for (let i = 0; i < 10; i++) {
        check = (check + parseInt(value[i], 10)) % 10;
        if (check === 0) check = 10;
        check = (check * 2) % 11;
    }

    const controlDigit = (11 - check) % 10;
    if (controlDigit !== parseInt(value[10], 10)) {
        if (debug) { console.log("Invalid checksum"); }
        return false;
    }

    return true;
}

async function online_check(tin: string, debug: boolean = false): Promise<boolean> {
    // Extract the relevant portion of the TIN (excluding the msCode)
    const processedTin = tin.substring(2);

    try {
        const response = await axios.post('https://ec.europa.eu/taxation_customs/tin/rest-api/tinRequest', {
            msCode: 'HR',
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

export { validate_hr_oib, online_check };
