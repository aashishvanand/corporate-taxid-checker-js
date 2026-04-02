declare function validate_si_ddv(input: string, debug?: boolean): boolean;
declare function online_check(tin: string, debug?: boolean): Promise<boolean>;
export { validate_si_ddv, online_check };
