/**
 * LLM tool definitions for corporate-taxid-checker-js.
 *
 * These follow the OpenAI/Anthropic function-calling JSON Schema format
 * and can be passed directly to any LLM that supports tool use.
 *
 * @example
 * ```typescript
 * import { taxIdTools } from 'corporate-taxid-checker-js/tools';
 *
 * // Pass to OpenAI
 * const response = await openai.chat.completions.create({
 *     model: 'gpt-4',
 *     messages,
 *     tools: taxIdTools.map(t => ({ type: 'function', function: t })),
 * });
 *
 * // Pass to Anthropic
 * const response = await anthropic.messages.create({
 *     model: 'claude-sonnet-4-20250514',
 *     messages,
 *     tools: taxIdTools.map(t => ({
 *         name: t.name,
 *         description: t.description,
 *         input_schema: t.parameters,
 *     })),
 * });
 * ```
 */

export interface ToolDefinition {
    name: string;
    description: string;
    parameters: {
        type: 'object';
        properties: Record<string, {
            type: string;
            description: string;
            enum?: string[];
            items?: { type: string };
            default?: unknown;
            minimum?: number;
            maximum?: number;
        }>;
        required: string[];
    };
}

export const taxIdTools: ToolDefinition[] = [
    {
        name: 'validateTaxId',
        description: 'Validate a tax identification number (TIN/VAT/EIN/GST) for a specific country. Checks the format against known regex patterns and, where available, verifies the checksum. Set onlineCheckRequired to true to also verify against the country\'s official government endpoint (slower, requires network access).',
        parameters: {
            type: 'object',
            properties: {
                countryCode: {
                    type: 'string',
                    description: 'ISO 3166-1 alpha-2 country code (e.g., "DE" for Germany, "US" for United States, "GB" for United Kingdom). Overseas territory codes like "GF" (French Guiana) are automatically resolved to their parent country.'
                },
                taxId: {
                    type: 'string',
                    description: 'The tax identification number to validate (e.g., "ATU62123456", "123-45-6789").'
                },
                onlineCheckRequired: {
                    type: 'boolean',
                    description: 'When true, also verifies the tax ID against the country\'s online government endpoint. This is slower and requires network access. Default: false.',
                    default: false
                }
            },
            required: ['countryCode', 'taxId']
        }
    },
    {
        name: 'validateTaxIds',
        description: 'Validate multiple tax IDs in a single call. Each item specifies a country code and tax ID. All validations run in parallel. Use this instead of calling validateTaxId multiple times.',
        parameters: {
            type: 'object',
            properties: {
                items: {
                    type: 'array',
                    description: 'Array of objects, each with a countryCode (ISO 3166-1 alpha-2) and taxId string.',
                    items: { type: 'object' }
                },
                onlineCheckRequired: {
                    type: 'boolean',
                    description: 'When true, also performs online verification for all items. Default: false.',
                    default: false
                }
            },
            required: ['items']
        }
    },
    {
        name: 'getSupportedCountries',
        description: 'Returns a sorted list of all ISO 3166-1 alpha-2 country codes that this library can validate tax IDs for. Use this to check coverage before attempting validation.',
        parameters: {
            type: 'object',
            properties: {},
            required: []
        }
    },
    {
        name: 'isCountrySupported',
        description: 'Check whether a specific country code is supported for tax ID validation. Returns true for both direct country codes and overseas territory codes (e.g., "GF" for French Guiana maps to France).',
        parameters: {
            type: 'object',
            properties: {
                countryCode: {
                    type: 'string',
                    description: 'ISO 3166-1 alpha-2 country code to check (e.g., "DE", "US", "GF").'
                }
            },
            required: ['countryCode']
        }
    },
    {
        name: 'getTaxIdInfo',
        description: 'Get information about which tax ID types a country supports (e.g., VAT, TIN, EIN). Returns the label, type code, and whether checksum/online verification is available for each type. Useful for understanding what kinds of tax IDs a country uses before validation.',
        parameters: {
            type: 'object',
            properties: {
                countryCode: {
                    type: 'string',
                    description: 'ISO 3166-1 alpha-2 country code (e.g., "DE", "US").'
                }
            },
            required: ['countryCode']
        }
    },
    {
        name: 'sanitize',
        description: 'Clean and normalize a tax ID string by removing common separators (spaces, dashes, dots, slashes) and converting to uppercase. Use this to prepare user-entered tax IDs before validation.',
        parameters: {
            type: 'object',
            properties: {
                input: {
                    type: 'string',
                    description: 'Raw tax ID string to sanitize (e.g., "AT U62-123.456").'
                }
            },
            required: ['input']
        }
    },
    {
        name: 'maskTaxId',
        description: 'Mask a tax ID for safe display by replacing leading characters with a mask character, preserving only the last N alphanumeric characters. Non-alphanumeric separators (dashes, dots) are preserved in place. Example: maskTaxId("20-1234567-01", 4) returns "XX-XXXXXXX-01".',
        parameters: {
            type: 'object',
            properties: {
                taxId: {
                    type: 'string',
                    description: 'The tax ID to mask.'
                },
                visibleCount: {
                    type: 'number',
                    description: 'Number of trailing alphanumeric characters to keep visible. Default: 4.',
                    default: 4,
                    minimum: 0
                },
                maskChar: {
                    type: 'string',
                    description: 'Character used for masking. Default: "X".',
                    default: 'X'
                }
            },
            required: ['taxId']
        }
    }
];

export default taxIdTools;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = taxIdTools;
    module.exports.taxIdTools = taxIdTools;
}
