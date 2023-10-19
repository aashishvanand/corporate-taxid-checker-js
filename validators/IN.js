function validate_in_gst(gst) {
    const chars = [...'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
    const values = [...gst.toUpperCase()];
    const lastChar = values.pop();
    const sum = values
      .map((char, index) => {
        const product = chars.indexOf(char) * (index % 2 !== 0 ? 2 : 1);
        return Math.floor(product / chars.length) + (product % chars.length);
      })
      .reduce((prev, current) => {
        return prev + current;
      }, 0);
    const checksum = (chars.length - (sum % chars.length)) % chars.length;
    const isValid = chars[checksum] === lastChar;
    return isValid;
}

function validate_in_pan(pan) {
    // Define the valid types for the fourth character
    const validTypes = ['A', 'B', 'C', 'F', 'G', 'H', 'L', 'J', 'P', 'T', 'E'];

    const typeChar = pan[3].toUpperCase();

    // Validate the format and the type character
    return validTypes.includes(typeChar);
}

module.exports = { validate_in_gst, validate_in_pan };
