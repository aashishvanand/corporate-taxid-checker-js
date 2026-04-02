declare function validate_lu_tva(input: string, debug?: boolean): boolean;
declare function online_check(tin: string, debug?: boolean): Promise<boolean>;
export { validate_lu_tva, online_check };
