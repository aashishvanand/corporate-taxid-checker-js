
const OTHER_UEN_ENTITY_TYPES = [
    'CC', 'CD', 'CH', 'CL', 'CM', 'CP', 'CS', 'CX', 'DP', 'FB', 'FC', 'FM', 'FN',
    'GA', 'GB', 'GS', 'HS', 'LL', 'LP', 'MB', 'MC', 'MD', 'MH', 'MM', 'MQ', 'NB',
    'NR', 'PA', 'PB', 'PF', 'RF', 'RP', 'SM', 'SS', 'TC', 'TU', 'VH', 'XL',
];

function weightedSum(input, config) {
    const { weights, modulus } = config;
    let sum = 0;
    for (let i = 0; i < input.length; i++) {
      sum += parseInt(input[i], 10) * weights[i];
    }
    return sum % modulus;
}

function validate_sg_uen(uen, debug=false) {

    // Clean the input
    const value = uen.replace(/\s+/g, '');

    if (value.length !== 9 && value.length !== 10) {
        if (debug) {
            console.log("Invalid length");
        }
        return false;
    }

    if (value.length === 9) {
        return validateBusiness(value);
    }
    if (/^\d/.test(value)) {
        return validateLocal(value);
    }

    return validateOther(value);
}

function validateLocal(value) {
    const front = value.substring(0, value.length - 1);
    const check = value[value.length - 1];

    if (!/^\d+$/.test(front)) {
        return false;
    }

    // Implement the weightedSum and modulus logic here
    // Assuming you have a weightedSum function available
    const sum = weightedSum(front, {
        modulus: 11,
        weights: [10, 8, 6, 4, 9, 7, 5, 3, 1],
    });

    const digit = 'ZKCMDNERGWH'[sum % 11];

    if (check !== digit) {
        return false;
    }

    return true
    ;
}

function validateBusiness(value) {
    const front = value.substring(0, value.length - 1);
    const check = value[value.length - 1];

    if (!/^\d+$/.test(front)) {
        return false;
    }

    const sum = weightedSum(front, {
        modulus: 11,
        weights: [10, 4, 9, 3, 8, 2, 7, 1],
    });

    const digit = 'XMKECAWLJDB'[sum];

    if (check !== digit) {
        return false;
    }

    return true
}

function validateOther(value) {
    const kind = value[0];
    const year = value.substr(1, 2);
    const etype = value.substr(3, 2);
    const rest = value.substring(5, value.length - 1);
    const check = value[value.length - 1];

    if (!['R', 'S', 'T'].includes(kind) || 
        !/^\d+$/.test(year) ||
        !OTHER_UEN_ENTITY_TYPES.includes(etype) ||
        !/^\d+$/.test(rest)) {
        return false;
    }

    if (kind === 'T' && parseInt(year, 10) > new Date().getFullYear() % 100) {
        return false;
    }

    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWX0123456789';
    const sum = weightedSum(value.substr(0, 9), {
        weights: [4, 3, 5, 3, 10, 2, 2, 5, 7],
        modulus: 11,
        alphabet,
    });

    const digit = alphabet[(sum + 6) % 11];

    if (check !== digit) {
        return false;
    }

    return true
}

module.exports = { validate_sg_uen };