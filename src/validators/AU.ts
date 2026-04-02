import { weightedSum } from '../utils';

function validate_au_abn(abn: string, debug: boolean = false): boolean {
    let wSum = 0;
    const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];

    for (let i = 0; i < 11; i++) {
        // Subtract 1 from the first digit (i == 0) and then multiply by the weight
        const digit = (parseInt(abn[i], 10) - (i === 0 ? 1 : 0)) * weights[i];
        wSum += digit;
    }

    if (wSum % 89 !== 0) {
        if (debug) {
            console.log("Invalid checksum");
        }
        return false;
    }

    return true;
}

function validate_au_tfn(tfn: string, debug: boolean = false): boolean {
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

async function online_check(abn: string, debug: boolean = false): Promise<boolean> {
    let axios: any, cheerio: any;
    try {
        axios = require('axios');
    } catch (e) {
        if (debug) console.error('Online checks require axios. Install it with: npm install axios');
        return false;
    }
    try {
        cheerio = require('cheerio');
    } catch (e) {
        if (debug) console.error('AU online check requires cheerio. Install it with: npm install cheerio');
        return false;
    }
    try {
        const response = await axios.default.post('https://abr.business.gov.au/Search/Run', {
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
            const details: Record<string, string> = {};
            // Extraction logic will be refined after further inspection
            $('table tr').each((i: any, row: any) => {
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
    return false;
}

export { validate_au_abn, validate_au_tfn, online_check };
