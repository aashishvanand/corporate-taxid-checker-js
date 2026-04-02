declare function validate_dk_cvr(cvr: string, debug?: boolean): boolean;
declare function online_check(tin: string, debug?: boolean): Promise<boolean>;
export { validate_dk_cvr, online_check };
