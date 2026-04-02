declare function validate_bg_vat(vat: string, debug?: boolean): boolean;
declare function online_check(tin: string, debug?: boolean): Promise<boolean>;
export { validate_bg_vat, online_check };
