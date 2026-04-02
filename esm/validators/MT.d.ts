declare function validate_mt_vat(vat: string, debug?: boolean): boolean;
declare function online_check(tin: string, debug?: boolean): Promise<boolean>;
export { validate_mt_vat, online_check };
