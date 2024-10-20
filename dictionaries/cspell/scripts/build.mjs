#!/usr/bin/env node

import fs from 'node:fs/promises';

async function main() {
    const pkg = JSON.parse(await fs.readFile('package.json', 'utf8'));
    const cspellExt = JSON.parse(await fs.readFile('cspell-ext.json', 'utf8'));

    const dicts = Object.keys(pkg.dependencies).filter((dep) => dep.startsWith('@cspell/dict-'));
    cspellExt.import = dicts.map((dict) => dict + `/cspell-ext.json`).sort();
    await fs.writeFile('cspell-ext.json', JSON.stringify(cspellExt, null, 4) + '\n');
}

main();
