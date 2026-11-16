

function iso7064mod10x11validate(value: string): boolean {
    var check = value
        .split('')
        .map(function(v) { return parseInt(v, 10); })
        .reduce(function(acc, v) { 
            return ((((acc === 0 ? 10 : acc) * 2) % 11) + v) % 10; 
        }, 5);

    return check === 1;
}

function validate_de_vat(vat: string, debug: boolean = false): boolean {

    // Strip the DE prefix if present, checksum applies to the 9-digit numeric part only
    const numericPart = vat.toUpperCase().startsWith('DE') ? vat.substring(2) : vat;

    if (!iso7064mod10x11validate(numericPart)) {
        if (debug) { 
            console.log("Invalid checksum");
        }
        return false;
    }

    return true;
}

function validate_de_stnr(stnr: string, debug: boolean = false): boolean {
    // Build match function
    function buildMatch(fmt: string) {
        var pattern = fmt.replace(/([FBUP])\1*/g, function(m: string) {
            return "(\\d{" + m.length + "})";
        });
        var matcher = new RegExp("^" + pattern + "$");

        return function(value: string) {
            var m = matcher.exec(value);
            if (!m) {
                return { match: false };
            }
            return {
                match: true,
                f: m[1] || '',
                b: m[2] || '',
                u: m[3] || '',
                p: m[4] || '',
            };
        };
    }

    // Build matcher
    function buildMatcher(rfmt: string, cfmt: string) {
        return {
            region: buildMatch(rfmt),
            country: buildMatch(cfmt),
        };
    }

    // Define region formats
    var REGION_FORMATS = {
        'DE-BW': buildMatcher('FFBBBUUUUP', '28FF0BBBUUUUP'),
        'DE-BY': buildMatcher('FFFBBBUUUUP', '9FFF0BBBUUUUP'),
        'DE-BE': buildMatcher('FFBBBUUUUP', '11FF0BBBUUUUP'),
        'DE-BB': buildMatcher('0FFBBBUUUUP', '30FF0BBBUUUUP'),
        'DE-HB': buildMatcher('FFBBBUUUUP', '24FF0BBBUUUUP'),
        'DE-HH': buildMatcher('FFBBBUUUUP', '22FF0BBBUUUUP'),
        'DE-HE': buildMatcher('0FFBBBUUUUP', '26FF0BBBUUUUP'),
        'DE-MV': buildMatcher('0FFBBBUUUUP', '40FF0BBBUUUUP'),
        'DE-NI': buildMatcher('FFBBBUUUUP', '23FF0BBBUUUUP'),
        'DE-NW': buildMatcher('FFFBBBBUUUP', '5FFF0BBBBUUUP'),
        'DE-RP': buildMatcher('FFBBBUUUUP', '27FF0BBBUUUUP'),
        'DE-SL': buildMatcher('0FFBBBUUUUP', '10FF0BBBUUUUP'),
        'DE-SN': buildMatcher('2FFBBBUUUUP', '32FF0BBBUUUUP'),
        'DE-ST': buildMatcher('1FFBBBUUUUP', '31FF0BBBUUUUP'),
        'DE-SH': buildMatcher('FFBBBUUUUP', '21FF0BBBUUUUP'),
        'DE-TH': buildMatcher('1FFBBBUUUUP', '41FF0BBBUUUUP'),
    };
    
    // Find match function
    function findMatch(value: string) {
        var result = null;

        Object.values(REGION_FORMATS).some(function(_ref) {
            var region = _ref.region,
                country = _ref.country;
            var rResult = region(value);
            if (rResult.match) {
                result = rResult;
                return true;
            }
            var cResult = country(value);
            if (cResult.match) {
                result = cResult;
                return true;
            }
            return false;
        });

        return result;
    }

    // Assuming stnr is already cleaned and in the correct format
    // and that the length check and format check have been done outside this function

    // Check for region match
    if (findMatch(stnr) === null) {
        if (debug) { 
            console.log("Invalid format");
        }
        return false;
    }

    // ... [The rest of your validation logic]

    return true;
}

export { validate_de_stnr, validate_de_vat };
