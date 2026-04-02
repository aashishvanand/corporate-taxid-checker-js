
function compute_digit_cnpj(input: string): number {
  const mlen = input.length + 7;
  const value =
    11 -
    (input
      .split('')
      .map((v: string, idx: number) => parseInt(v, 10) * (((mlen - idx) % 8) + 2))
      .reduce((acc: number, v: number) => acc + v) %
      11);

  return value > 9 ? 0 : value;
}

function compute_digit_cpf(input: string): number {
  const mlen = input.length + 1;
  const value = input
    .split('')
    .map((v: string, idx: number) => parseInt(v, 10) * (mlen - idx))
    .reduce((acc: number, v: number) => (acc + v) % 11);

  return value < 2 ? 0 : 11 - value;
}

function validate_br_cnpj(cnpj: string, debug: boolean = false): boolean {
    const c1 = cnpj[12];
    const c2 = cnpj[13];

    const d1 = compute_digit_cnpj(cnpj.slice(0, 12)); // Assuming computeDigit is defined elsewhere
    const d2 = compute_digit_cnpj(cnpj.slice(0, 13)); // Assuming computeDigit is defined elsewhere

    if (String(d1) !== c1 || String(d2) !== c2) {
        if (debug) {
            console.log("Invalid checksum");
        }
        return false;
    }

    return true;
}

function validate_br_cpf(cpf: string, debug: boolean = false): boolean {
  const c1 = cpf[9];
  const c2 = cpf[10];

  const d1 = compute_digit_cpf(cpf.slice(0, 9));
  const d2 = compute_digit_cpf(cpf.slice(0, 10));

  if (String(d1) !== c1 || String(d2) !== c2) {
      if (debug) {
          console.log("Invalid checksum");
      }
      return false;
  }

  return true;
}

export { validate_br_cnpj, validate_br_cpf };
