declare function validate_sk_dph(dph: string, debug?: boolean): boolean;
declare function online_check(tin: string, debug?: boolean): Promise<boolean>;
export { validate_sk_dph, online_check };
