declare function validate_fi_alv(input: string, debug?: boolean): boolean;
declare function online_check(tin: string, debug?: boolean): Promise<boolean>;
export { validate_fi_alv, online_check };
