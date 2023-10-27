
function validate_au_abn(abn, debug=false) {
    let weightedSum = 0;
    const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];

    for (let i = 0; i < 11; i++) {
        // Subtract 1 from the first digit (i == 0) and then multiply by the weight
        const digit = (parseInt(abn[i], 10) - (i === 0 ? 1 : 0)) * weights[i];
        weightedSum += digit;
    }

    if (weightedSum % 89 !== 0) {
        if (debug) { 
            console.log("Invalid checksum");
        }
        return false;
    }

    return true;
}

function validate_au_tfn(tfn, debug=false) {
    const weights = [1, 4, 3, 7, 5, 8, 6, 9, 10];
    const sum = weightedSum(tfn, weights, 11);

    if (sum !== 0) {
        if (debug) { 
            console.log("Invalid checksum");
        }
        return false;
    }

    return true;
}

function weightedSum(number, weights, modulus) {
    let sum = 0;

    for (let i = 0; i < number.length; i++) {
        sum += parseInt(number[i], 10) * weights[i];
    }

    return sum % modulus;
}

async function online_check(abn, debug=false) {
    const axios = require('axios');
    const cheerio = require('cheerio');
    try {
        const response = await axios.post('https://abr.business.gov.au/Search/Run', {
            SearchParameters: {
                SearchText: abn
            }
        });
        
        if (response.status !== 200) {
            if (debug) console.log(`Request failed with status: ${response.status}`);
            return false;
        }

        // Use cheerio to parse the HTML response
        const $ = cheerio.load(response.data);
        const title = $('title').text();

        // Check for invalid ABN
        if (title.includes('Invalid ABN')) {
            return false;
        }

        // Check for valid ABN and extract details
        if (title.includes('Current details for ABN')) {
            const details = {};
            // Extraction logic will be refined after further inspection
            $('table tr').each((i, row) => {
                const key = $(row).find('td').first().text().trim();
                const value = $(row).find('td').last().text().trim();
                if (key && value) {
                    details[key] = value;
                }
            });
            if (debug) { 
                console.log("ABN Details:",details);
            }
            return true;
        }

    } catch (error) {
        if (debug) console.log('Axios request error:', error);
        console.error(error);
        return false;
    }
}



if (typeof module !== 'undefined' && module.exports) {
    module.exports = { validate_au_abn, validate_au_tfn, online_check };
} else {
    window.validate_au_abn = validate_au_abn;
    window.validate_au_tfn = validate_au_tfn;
    window.online_check = online_check;
}