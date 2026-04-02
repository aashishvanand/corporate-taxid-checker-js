declare function validate_hu_anum(input: string, debug?: boolean): boolean;
declare function online_check(tin: string, debug?: boolean): Promise<boolean>;
export { validate_hu_anum, online_check };
