
function validate_ca_bn(bn, debug=false) {
    const front = bn.slice(0, 9);
    const rest = bn.slice(9);

    if (!luhnChecksumValidate(front)) {
        if (debug) { 
            console.log("Invalid checksum");
        }
        return false;
    }

    if (rest) {
        const a = rest.slice(0, 2);
        const b = rest.slice(2);

        if (!['RC', 'RM', 'RP', 'RT'].includes(a) || isNaN(b)) {
            if (debug) { 
                console.log("Invalid component");
            }
            return false;
        }
    }

    return true;
}

function luhnChecksumValidate(input) {
    const value = input.split('').reverse();
    const sum = value.reduce((acc, num, idx) => {
        let val = parseInt(num, 10);

        if (idx % 2 === 1) {
            val *= 2;
            if (val > 9) {
                val -= 9;
            }
        }

        return acc + val;
    }, 0);

    return sum % 10 === 0;
}

function validate_ca_qst(qst, debug=false) {
    const front = qst.slice(0, 9);
    const check = qst.slice(9, 10);
    const serial = qst.slice(12);
  
    if (serial === '0000') {
        if (debug) { 
            console.log("Invalid component");
        }
        return false;
    }
  
    const sum = weightedSum(front, [4, 3, 2, 7, 6, 5, 4, 3, 2], 11);
  
    if (String((11 - sum) % 10) !== check) {
        if (debug) { 
            console.log("Invalid checksum");
        }
        return false;
    }
  
    return true;
  }

function weightedSum(number, weights, modulus) {
  let sum = 0;

  for (let i = 0; i < number.length; i++) {
      sum += parseInt(number[i], 10) * weights[i];
  }

  return sum % modulus;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {validate_ca_bn, validate_ca_qst};
  } else {
    window.validate_ca_bn = validate_ca_bn;
    window.validate_ca_qst = validate_ca_qst;
  }
