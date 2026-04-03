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
            items?: {
                type: string;
            };
            default?: unknown;
            minimum?: number;
            maximum?: number;
        }>;
        required: string[];
    };
}
export declare const taxIdTools: ToolDefinition[];
export default taxIdTools;
