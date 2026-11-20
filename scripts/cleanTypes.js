#!/usr/bin/env node
/**
 * Removes declaration files for the internal per-country validators after
 * `tsc --emitDeclarationOnly`.
 *
 * `src/validators/*` is only reachable through the private static registry; no public
 * type references it, and the `exports` map does not expose it. Shipping the folder
 * just adds ~80 unreachable `.d.ts` files to the tarball.
 */
const fs = require('fs');
const path = require('path');

const target = path.resolve(__dirname, '..', 'types', 'validators');

if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
    console.log('Removed types/validators');
} else {
    console.log('types/validators not present; nothing to remove');
}
