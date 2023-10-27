  
  function validate_gt_nit(input, debug=false) {
    const value = input;
  
    if (value.length < 2 || value.length > 12) {
      if (debug) { console.log("Invalid Length"); }
        return false;
    }
  
    const front = value.substring(0, value.length - 1);
    const check = value.substring(value.length - 1);
  
    // For simplicity, we'll use a regular expression to check if the input is all digits
    
  
    const checkDigit = '0123456789ABCDEFGHIJKLMN';
    if (!checkDigit.includes(check)) {
      if (debug) { console.log("InvalidComponent"); }
        return false;
    }
  
    const weights = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    let sum = 0;
  
    for (let i = 0; i < front.length; i++) {
      const digit = parseInt(front[front.length - 1 - i], 10);
      sum += digit * weights[i];
    }
  
    sum = (11 - (sum % 11)) % 11;
  
    if (check !== checkDigit[sum]) {
      if (debug) { console.log("Invalid Checksum"); }
        return false;
    }
  
    return true;
  }
  
  module.exports = { validate_gt_nit };
  