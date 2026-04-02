declare function validate_nl_btw(btw: string, debug?: boolean): boolean;
declare function online_check(tin: string, debug?: boolean): Promise<boolean>;
export { validate_nl_btw, online_check };
