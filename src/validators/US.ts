// EIN prefixes the IRS has assigned to its campuses (no check digit exists)
const VALID_EIN_PREFIXES = new Set([
    '01', '02', '03', '04', '05', '06',
    '10', '11', '12', '13', '14', '15', '16',
    '20', '21', '22', '23', '24', '25', '26', '27',
    '30', '31', '32', '33', '34', '35', '36', '37', '38', '39',
    '40', '41', '42', '43', '44', '45', '46', '47', '48',
    '50', '51', '52', '53', '54', '55', '56', '57', '58', '59',
    '60', '61', '62', '63', '64', '65', '66', '67', '68',
    '71', '72', '73', '74', '75', '76', '77',
    '80', '81', '82', '83', '84', '85', '86', '87', '88',
    '90', '91', '92', '93', '94', '95', '98', '99',
]);

function validate_us_ein(input: string, debug: boolean = false): boolean {
    const value = input.replace(/[\s-]/g, '');

    if (!/^\d{9}$/.test(value)) {
        if (debug) { console.log("Invalid format"); }
        return false;
    }

    if (!VALID_EIN_PREFIXES.has(value.slice(0, 2))) {
        if (debug) { console.log("Unassigned EIN prefix"); }
        return false;
    }

    return true;
}

export { validate_us_ein };
