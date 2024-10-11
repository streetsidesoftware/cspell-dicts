#!/usr/bin/env node

import fs from 'node:fs/promises';
import { globby } from 'globby';

const rootUrl = new URL('../', import.meta.url);

/**
 * Update fields in the package.json file.
 * - the repository - see: [package.json repository](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#repository)
 * @param {string[]} pkgFile
 */
async function updatePackageJson(pkgFile) {
    const directory = pkgFile.split(/[/\\]/g).slice(-3, -1).join('/');
    console.log(directory);

    const pkg = JSON.parse(await fs.readFile(pkgFile, 'utf-8'));

    const repository = {
        type: 'git',
        url: 'https://github.com/streetsidesoftware/cspell-dicts',
        directory,
    };

    pkg.repository = repository;
    pkg.author = 'Street Side Software <support@streetsidesoftware.nl>';
    pkg.publishConfig = {
        access: 'public',
        provenance: true,
    };

    await fs.writeFile(pkgFile, JSON.stringify(pkg, null, 2) + '\n');
}

async function run() {
    console.log('Updating package.json files...\n');

    const glob = process.argv[2] || 'dictionaries/*/package.json';

    const files = await globby(glob, { cwd: rootUrl, absolute: true });

    if (!files.length) {
        console.log('No package.json files found.');
        return;
    }

    await Promise.all(files.map(updatePackageJson));
    console.log('\nDone.');
}

run();
