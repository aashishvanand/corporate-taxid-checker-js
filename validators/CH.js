
function sumAllDigits(number) {
    return number.toString().split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0);
}

function weightedSum(value, { alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', reverse = false, weights = [1], modulus = 0, sumByDigit = false }) {
    const wlen = weights.length;
    const numbers = value.split('').map(v => alphabet.indexOf(v));
    const weighted = (reverse ? numbers.reverse() : numbers).map((v, idx) => v * weights[idx % wlen]);

    return weighted.reduce((acc, v) => {
        let vv = v;
        while (vv < 0) {
            vv += modulus;
        }

        if (sumByDigit && vv > 9) {
            return (acc + sumAllDigits(vv)) % modulus;
        }

        return (acc + vv) % modulus;
    }, 0);
}

function validate_ch_vat(vat, debug=false) {
    if (vat.length !== 15 && vat.length !== 16) {
        if (debug) { console.log("Invalid length"); }
        return false;
    }

    const front = vat.slice(0, 12);
    const sufix = vat.slice(12);
    if (!['MWST', 'TVA', 'IVA', 'TPV'].includes(sufix)) {
        if (debug) { console.log("Invalid Component"); }
        return false;
    }

    const result = uidValidate(front);

    if (!result.isValid && result.error) {
        if (debug) { console.log(result.error); }
        return false;
    }

    return true;
}

function uidValidate(uid) {
    if (uid.length !== 12) {
        if (debug) { console.log("Invalid length"); }
        return false;
    }
    if (!uid.startsWith('CHE') || isNaN(uid.slice(3))) {
        if (debug) { console.log("Invalid Format"); }
        return false;
    }

    const front = uid.slice(3, -1);
    const check = uid.slice(-1);

    const sum = weightedSum(front, {
        modulus: 11,
        weights: [5, 4, 3, 2, 7, 6, 5, 4],
    });

    if (String((11 - sum) % 11) !== check) {
        if (debug) { console.log("Invalid Checksum"); }
        return false;
    }

    return true;
}

module.exports = { validate_ch_vat };