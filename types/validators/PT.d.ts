declare function validate_pt_nif(nif: string, debug?: boolean): boolean;
declare function online_check(tin: string, debug?: boolean): Promise<boolean>;
export { validate_pt_nif, online_check };
