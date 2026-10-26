#!/usr/bin/env node

// Prepares a private dictionary for its first publication. Run with --help for usage.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { program } from 'commander';
import { format } from 'prettier';

import { currentPackageName } from './lib/current-package.mts';
import {
    privateSuffix,
    publicationVersions,
    publishedFile,
    readPublished,
    recordPending,
    writePublished,
} from './lib/publication.mts';
import { findDictionaryPackages } from './lib/find-dictionary-packages.mts';
import { setReleaseAs } from './lib/release-as.mts';

const rootDir = fileURLToPath(new URL('../', import.meta.url));

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
    if (!pkg.private) throw new Error(`${name} is already public.`);
    const published = await readPublished(rootDir);
    if (published[name] === false) throw new Error(`${publishedFile} marks ${name} as never to be published.`);

    const { releaseAs, version } = publicationVersions(pkg.version);
    delete pkg.private;
    if (typeof pkg.description === 'string') pkg.description = pkg.description.replace(privateSuffix, '');
    pkg.version = version;
    await fs.writeFile(pkgFile, await format(JSON.stringify(pkg, undefined, 2), { filepath: pkgFile }));
    console.log(
        `${name}: removed private and "-- Private until verified", version ${version} (${path.relative(rootDir, pkgFile)})`,
    );

    await setReleaseAs(rootDir, [name], releaseAs);

    await writePublished(rootDir, recordPending(published, name));
    console.log(`${name}: waiting for publication in ${publishedFile}`);
}

program
    .name('prepare-publication')
    .description(
        'Make a private dictionary public: remove `private` and "-- Private until verified" from its package.json,\n' +
            'set its `release-as` to 1.0.0, or the next minor version if it is 1.0.0 or later, make its version an\n' +
            `alpha of that, and record it in ${publishedFile} as waiting for publication.`,
    )
    .argument('[package]', 'package name, such as @cspell/dict-perl; default: the package in the current folder')
    .action(run);

await program.parseAsync();
