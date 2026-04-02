declare function validate_hr_oib(oib: string, debug?: boolean): boolean;
declare function online_check(tin: string, debug?: boolean): Promise<boolean>;
export { validate_hr_oib, online_check };
