declare function validate_au_abn(abn: string, debug?: boolean): boolean;
declare function validate_au_tfn(tfn: string, debug?: boolean): boolean;
declare function online_check(abn: string, debug?: boolean): Promise<boolean>;
export { validate_au_abn, validate_au_tfn, online_check };
