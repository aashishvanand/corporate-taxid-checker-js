declare function validate_pl_nip(nip: string, debug?: boolean): boolean;
declare function online_check(tin: string, debug?: boolean): Promise<boolean>;
export { validate_pl_nip, online_check };
