declare function validate_at_abn(input: string, debug?: boolean): boolean;
declare function online_check(tin: string, debug?: boolean): Promise<boolean>;
export { validate_at_abn, online_check };
