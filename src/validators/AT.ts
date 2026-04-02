import axios from 'axios';


function validate_at_abn(input: string, debug: boolean = false): boolean {
    // Strip AT prefix and U prefix to get the 8-digit numeric part
    let value = input.toUpperCase();
    if (value.startsWith('AT')) {
        value = value.substring(2);
    }
    if (value.startsWith('U')) {
        value = value.substring(1);
    }

    if (value.length !== 8 || !/^\d{8}$/.test(value)) {
        if (debug) { console.log("Invalid format: expected 8 digits after U prefix"); }
        return false;
    }

    // Austrian VAT checksum: weights [1,2,1,2,1,2,1] on first 7 digits
    // with digit-sum reduction for products >= 10
    let sum = 0;
    const weights = [1, 2, 1, 2, 1, 2, 1];
    for (let i = 0; i < 7; i++) {
        let product = parseInt(value[i], 10) * weights[i];
        if (product >= 10) {
            product = Math.floor(product / 10) + (product % 10);
        }
        sum += product;
    }

    const expected = (10 - ((sum + 4) % 10)) % 10;
    const check = parseInt(value[7], 10);

    if (expected !== check) {
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
            msCode: 'AT',
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

export { validate_at_abn, online_check };
