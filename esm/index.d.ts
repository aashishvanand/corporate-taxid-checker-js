import { sanitize, maskTaxId } from './utils';
export interface TaxIdValidationResult {
    isValid: boolean;
    regexValid: boolean;
    checkSumCheckPresent: boolean;
    checkSum: boolean;
    onlineCheckPresent: boolean;
    onlineCheck: boolean;
    matchedType?: string;
    matchedLabel?: string;
}
export interface BulkValidationItem {
    countryCode: string;
    taxId: string;
}
export interface BulkValidationResult extends BulkValidationItem {
    result: TaxIdValidationResult | string;
}
export interface TaxIdTypeInfo {
    label: string;
    type: string;
    hasChecksum: boolean;
    hasOnlineCheck: boolean;
}
declare function validateTaxId(countryCode: string, taxId: string, onlineCheckRequired?: boolean, debug?: boolean): Promise<TaxIdValidationResult | string>;
declare function validateTaxIds(items: BulkValidationItem[], onlineCheckRequired?: boolean, debug?: boolean): Promise<BulkValidationResult[]>;
declare function getSupportedCountries(): string[];
declare function isCountrySupported(countryCode: string): boolean;
declare function getTaxIdInfo(countryCode: string): TaxIdTypeInfo[] | string;
export { validateTaxId, validateTaxIds, getSupportedCountries, isCountrySupported, getTaxIdInfo, sanitize, maskTaxId };
export default validateTaxId;
