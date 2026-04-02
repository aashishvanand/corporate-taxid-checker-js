declare function validate_cy_vat(vat: string, debug?: boolean): boolean;
declare function online_check(tin: string, debug?: boolean): Promise<boolean>;
export { validate_cy_vat, online_check };
