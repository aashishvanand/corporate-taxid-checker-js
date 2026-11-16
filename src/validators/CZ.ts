
function validate_cz_dic(dic: string, debug: boolean = false): boolean {

    function checkLegal(value: string) {
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

    function checkSpecial(value: string) {
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

    if (dic.length < 8 || dic.length > 10) {
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
    if (dic.length === 9) {
        // 9-digit individual type 1 (birth number YYMMDD + sequence)
        // Validate basic date component
        const mm = parseInt(dic.slice(2, 4), 10);
        // Month can be +50 for females, +20 for some cases
        const realMonth = mm > 50 ? mm - 50 : mm > 20 ? mm - 20 : mm;
        if (realMonth >= 1 && realMonth <= 12) {
            return true; // Format-valid birth number
        }
        if (debug) { console.log("Invalid date component"); }
        return false;
    }
    if (dic.length === 10) {
        // 10-digit individual (birth number with check digit)
        // Must be divisible by 11
        const num = parseInt(dic, 10);
        if (num % 11 === 0) {
            return true;
        }
        if (debug) { console.log("Invalid checksum: not divisible by 11"); }
        return false;
    }
    return false;
}

export { validate_cz_dic };
