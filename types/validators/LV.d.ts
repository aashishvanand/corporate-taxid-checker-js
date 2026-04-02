declare function validate_lv_pvn(input: string, debug?: boolean): boolean;
declare function online_check(tin: string, debug?: boolean): Promise<boolean>;
export { validate_lv_pvn, online_check };
