declare function validate_lt_pvm(input: string, debug?: boolean): boolean;
declare function online_check(tin: string, debug?: boolean): Promise<boolean>;
export { validate_lt_pvm, online_check };
