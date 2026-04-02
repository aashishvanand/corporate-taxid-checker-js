declare function validate_de_vat(vat: string, debug?: boolean): boolean;
declare function validate_de_stnr(stnr: string, debug?: boolean): boolean;
declare function online_check(tin: string, debug?: boolean): Promise<boolean>;
export { validate_de_stnr, validate_de_vat, online_check };
