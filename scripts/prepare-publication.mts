#!/usr/bin/env node

// Prepares a private dictionary for its first publication. Run with --help for usage.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { program } from 'commander';
import { format } from 'prettier';

import { currentPackageName } from './lib/current-package.mts';
import { findDictionaryPackages } from './lib/find-dictionary-packages.mts';
import { setReleaseAs } from './lib/release-as.mts';

const rootDir = fileURLToPath(new URL('../', import.meta.url));
const privateSuffix = /\s*--\s*Private until verified\s*$/;

async function run(name: string | undefined): Promise<void> {
    name ??= await currentPackageName(rootDir);
    if (!name) program.help({ error: true });

    const files = await findDictionaryPackages();
    let pkgFile: string | undefined;
    for (const file of files) {
        const pkg = JSON.parse(await fs.readFile(file, 'utf8'));
        if (pkg.name === name) pkgFile = file;
    }
    if (!pkgFile) throw new Error(`Not a dictionary package in this repo: ${name}`);

    const pkg = JSON.parse(await fs.readFile(pkgFile, 'utf8'));
    delete pkg.private;
    if (typeof pkg.description === 'string') pkg.description = pkg.description.replace(privateSuffix, '');
    await fs.writeFile(pkgFile, await format(JSON.stringify(pkg, undefined, 2), { filepath: pkgFile }));
    console.log(`${name}: removed private and "-- Private until verified" (${path.relative(rootDir, pkgFile)})`);

    await setReleaseAs(rootDir, [name], '1.0.0');
}

program
    .name('prepare-publication')
    .description(
        'Make a private dictionary public: remove `private` and "-- Private until verified" from its package.json,\n' +
            'and set its `release-as` to 1.0.0.',
    )
    .argument('[package]', 'package name, such as @cspell/dict-perl; default: the package in the current folder')
    .action(run);

await program.parseAsync();
