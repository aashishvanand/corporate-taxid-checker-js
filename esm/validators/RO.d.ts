declare function online_check(tin: string, debug?: boolean): Promise<boolean>;
declare function validate_ro_cif(input: string, debug?: boolean): boolean;
export { validate_ro_cif, online_check };
