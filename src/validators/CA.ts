import { weightedSum, luhnChecksumValidate } from '../utils';

function validate_ca_bn(bn: string, debug: boolean = false): boolean {
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

        if (!['RC', 'RM', 'RP', 'RT'].includes(a) || isNaN(Number(b))) {
            if (debug) { 
                console.log("Invalid component");
            }
            return false;
        }
    }

    return true;
}

function validate_ca_qst(qst: string, debug: boolean = false): boolean {
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

export { validate_ca_bn, validate_ca_qst };
