declare function validate_be_vat(vat: string, debug?: boolean): boolean;
declare function online_check(tin: string, debug?: boolean): Promise<boolean>;
export { validate_be_vat, online_check };
