declare function validate_it_iva(iva: string, debug?: boolean): boolean;
declare function online_check(tin: string, debug?: boolean): Promise<boolean>;
export { validate_it_iva, online_check };
