declare function validate_se_tin(input: string, debug?: boolean): boolean;
declare function validate_se_vat(input: string, debug?: boolean): boolean;
declare function online_check(tin: string, debug?: boolean): Promise<boolean>;
export { validate_se_tin, validate_se_vat, online_check };
