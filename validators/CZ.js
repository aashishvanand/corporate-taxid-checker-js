
function validate_cz_dic(dic, debug=false) {

    function checkLegal(value) {
        var front = value.slice(0, -1);
        var check = value.slice(-1);

        var weights = [8, 7, 6, 5, 4, 3, 2, 1];
        var sum = 0;
        for (var i = 0; i < front.length; i++) {
            sum += parseInt(front[i], 10) * weights[i];
        }

        var v = (11 - sum) % 11;
        return (v === 0 ? '1' : String(v % 10)) === check;
    }

    function checkSpecial(value) {
        var front = value.slice(0, -1);
        var check = value.slice(-1);

        var weights = [8, 7, 6, 5, 4, 3, 2, 1];
        var sum = 0;
        for (var i = 0; i < front.length; i++) {
            sum += parseInt(front[i], 10) * weights[i];
        }
        var digit = String((8 - ((10 - sum) % 11)) % 10);

        return digit === check;
    }

    if (![8, 9, 10].includes(dic.length)) {
        if (debug) { 
            console.log("Invalid length");
        }
        return false;
    }

    if (!/^\d+$/.test(dic)) {
        if (debug) { 
            console.log("Invalid format");
        }
        return false;
    }

    if (dic.length === 8) {
        if (dic.startsWith('9')) {
            if (debug) { 
                console.log("Invalid component");
            }
            return false;
        }

        if (!checkLegal(dic)) {
            if (debug) { 
                console.log("Invalid checksum");
            }
            return false;
        }

        return true
    }
    if (dic.length === 9 && dic.startsWith('6')) {
        if (!checkSpecial(dic)) {
            if (debug) { 
                console.log("Invalid checksum");
            }
            return false;
        }

        return true;
    }
}

async function online_check(tin,debug=false) {
    const axios = require('axios');
    
    // Extract the relevant portion of the TIN (excluding the msCode)
    const processedTin = tin.substring(2);
    
    try {
        const response = await axios.post('https://ec.europa.eu/taxation_customs/tin/rest-api/tinRequest', {
            msCode: 'CZ',
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


module.exports = { validate_cz_dic, online_check };