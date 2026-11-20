// Main validation function
function validate_lu_tva(input: string, debug: boolean = false): boolean {
    // Basic input cleanup and validation
    const value = input.replace(/\s/g, '');
    if (!value) {
      if (debug) {
        console.log("Input is empty after cleanup");
      }
      return false;
    }
    if (value.length !== 8) {
      if (debug) {
        console.log("Invalid length");
      }
      return false;
    }
    if (!/^\d+$/.test(value)) {
      if (debug) {
        console.log("Invalid format: Non-digit character detected");
      }
      return false;
    }
  
    // Split the value into relevant parts
    const front = value.substring(0, value.length - 2);
    const check = value.substring(value.length - 2);
  
    // Validate the checksum
    if (parseInt(front, 10) % 89 !== parseInt(check, 10)) {
      if (debug) {
        console.log("Invalid checksum");
      }
      return false;
    }
  
    return true;
  }

export { validate_lu_tva };
