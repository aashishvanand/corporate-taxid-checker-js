declare function validate_es_cif(cif: string, debug?: boolean): boolean;
declare function validate_es_vat(es: string, debug?: boolean): boolean;
declare function online_check(tin: string, debug?: boolean): Promise<boolean>;
export { validate_es_cif, validate_es_vat, online_check };
