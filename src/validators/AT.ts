
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

export { validate_at_abn };
