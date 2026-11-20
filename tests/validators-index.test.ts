/**
 * Guards the generated static validator registry (`src/validators/index.ts`).
 *
 * The registry is what makes the full offline validation usable from bundlers and
 * Cloudflare Workers, so it must not drift from the actual validator modules or from
 * `data.json`.
 */
import fs from 'fs';
import path from 'path';
import { validators } from '../src/validators';
import rawData from '../src/data.json';

const validatorsDir = path.resolve(__dirname, '..', 'src', 'validators');

describe('static validator registry', () => {
    const moduleCodes = fs
        .readdirSync(validatorsDir)
        .filter((file) => file.endsWith('.ts') && file !== 'index.ts')
        .map((file) => file.slice(0, -'.ts'.length))
        .sort();

    test('lists every validator module', () => {
        expect(Object.keys(validators).sort()).toEqual(moduleCodes);
    });

    test('every checksum-enabled data.json entry has a validator function', () => {
        const missing: string[] = [];
        for (const country of rawData as Array<{ ISOCountryCode: string; data: Array<{ type: string; checksum: boolean }> }>) {
            for (const entry of country.data) {
                if (!entry.checksum) continue;
                const fn = `validate_${entry.type}`;
                const mod = validators[country.ISOCountryCode];
                if (typeof mod?.[fn] !== 'function') missing.push(`${country.ISOCountryCode}:${fn}`);
            }
        }
        expect(missing).toEqual([]);
    });
});
