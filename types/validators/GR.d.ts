declare function validate_gr_vat(input: string, debug?: boolean): boolean;
declare function online_check(tin: string, debug?: boolean): Promise<boolean>;
export { validate_gr_vat, online_check };
