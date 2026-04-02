declare function validate_ie_vat(input: string, debug?: boolean): boolean;
declare function online_check(tin: string, debug?: boolean): Promise<boolean>;
export { validate_ie_vat, online_check };
