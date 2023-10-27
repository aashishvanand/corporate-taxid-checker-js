
function compute_digit_cnpj(input) {
  const mlen = input.length + 7;
  const value =
    11 -
    (input
      .split('')
      .map((v, idx) => parseInt(v, 10) * (((mlen - idx) % 8) + 2))
      .reduce((acc, v) => acc + v) %
      11);

  return value > 9 ? 0 : value;
}

function compute_digit_cpf(input) {
  const mlen = input.length + 1;
  const value = input
    .split('')
    .map((v, idx) => parseInt(v, 10) * (mlen - idx))
    .reduce((acc, v) => (acc + v) % 11);

  return value < 2 ? 0 : 11 - value;
}

f
function validate_br_cnpj(cnpj, debug=false) {
    const c1 = cnpj[12];
    const c2 = cnpj[13];

    const d1 = compute_digit_cnpj(cnpj.slice(0, 12)); // Assuming computeDigit is defined elsewhere
    const d2 = compute_digit_cnpj(cnpj.slice(0, 13)); // Assuming computeDigit is defined elsewhere

    if (d1 !== c1 || d2 !== c2) {
        if (debug) {
            console.log("Invalid checksum");
        }
        return false;
    }

    return true;
}

function validate_br_cpf(cpf, debug=false) {
  const c1 = cpf[9];
  const c2 = cpf[10];

  const d1 = compute_digit_cpf(cpf.slice(0, 9));
  const d2 = compute_digit_cpf(cpf.slice(0, 10));

  if (d1 !== c1 || d2 !== c2) {
      if (debug) { 
          console.log("Invalid checksum");
      }
      return false;
  }

  return true;
}

module.exports = { validate_br_cnpj,validate_br_cpf };
