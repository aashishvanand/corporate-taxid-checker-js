declare function validate_fr_nif(nif: string, debug?: boolean): boolean;
declare function validate_fr_vat(vat: string, debug?: boolean): boolean;
declare function online_check(tin: string, debug?: boolean): Promise<boolean>;
export { validate_fr_nif, validate_fr_vat, online_check };
