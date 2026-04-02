declare function validate_cz_dic(dic: string, debug?: boolean): boolean;
declare function online_check(tin: string, debug?: boolean): Promise<boolean>;
export { validate_cz_dic, online_check };
