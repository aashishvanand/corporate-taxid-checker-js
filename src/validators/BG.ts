import { weightedSum } from '../utils';
import axios from 'axios';

function validate_bg_vat(vat: string, debug: boolean = false): boolean {
    if (!['0', '1', '2', '3', '9'].includes(vat[0])) {
        if (debug) {
            console.log("Invalid format");
        }
        return false;
    }

    if (vat.length === 9) {
        return checkLegal(vat, debug);
    } else {
        return checkOther(vat); // Assuming checkOther is defined elsewhere
    }
}

function checkLegal(vat: string, debug: boolean = false): boolean {
    const weights = [1, 2, 3, 4, 5, 6, 7, 8];
    const front = vat.slice(0, -1);
    const check = vat.slice(-1);

    let sum = weightedSum(front, weights);

    if (sum === 10) {
        sum = weightedSum(front, [3, 4, 5, 6, 7, 8, 9, 10]);
    }

    if (String(sum % 10) !== check) {
        if (debug) {
            console.log("Invalid checksum");
        }
        return false;
    }

    return true;
}

function checkPhysicalPerson(value: string): boolean {
    // Validate date component (positions 0-5: YYMMDD)
    const yy = parseInt(value.slice(0, 2), 10);
    const mm = parseInt(value.slice(2, 4), 10);
    const dd = parseInt(value.slice(4, 6), 10);

    // Month can be offset: +20 for 1800s, +40 for 2000s
    const realMonth = mm > 40 ? mm - 40 : mm > 20 ? mm - 20 : mm;
    if (realMonth < 1 || realMonth > 12 || dd < 1 || dd > 31) return false;

    const weights = [2, 4, 8, 5, 10, 9, 7, 3, 6];
    const front = value.slice(0, 9);
    const check = value.slice(9);

    let sum = 0;
    for (let i = 0; i < front.length; i++) {
        sum += parseInt(front[i], 10) * weights[i];
    }

    let remainder = sum % 11;
    if (remainder === 10) remainder = 0;

    return String(remainder) === check;
}

function checkForeigner(value: string): boolean {
    const weights = [21, 19, 17, 13, 11, 9, 7, 3, 1];
    const front = value.slice(0, 9);
    const check = value.slice(9);

    let sum = 0;
    for (let i = 0; i < front.length; i++) {
        sum += parseInt(front[i], 10) * weights[i];
    }

    return String(sum % 10) === check;
}

function checkMisc(value: string): boolean {
    const weights = [4, 3, 2, 7, 6, 5, 4, 3, 2];
    const front = value.slice(0, 9);
    const check = value.slice(9);

    let sum = 0;
    for (let i = 0; i < front.length; i++) {
        sum += parseInt(front[i], 10) * weights[i];
    }

    let remainder = 11 - (sum % 11);
    if (remainder === 10) remainder = 0;
    if (remainder === 11) remainder = 0;

    return String(remainder) === check;
}

function checkOther(value: string): boolean {
    // 10-digit BG VATs can be physical person, foreigner, or miscellaneous
    return checkPhysicalPerson(value) || checkForeigner(value) || checkMisc(value);
}

async function online_check(tin: string, debug: boolean = false): Promise<boolean> {
    // Extract the relevant portion of the TIN (excluding the msCode)
    const processedTin = tin.substring(2);

    try {
        const response = await axios.post('https://ec.europa.eu/taxation_customs/tin/rest-api/tinRequest', {
            msCode: 'BG',
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

export { validate_bg_vat, online_check };
