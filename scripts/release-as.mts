#!/usr/bin/env node

// Sets or removes a package's `release-as` in release-please-config.json. Run with --help for usage.

import { fileURLToPath } from 'node:url';

import { program } from 'commander';

import { currentPackageName } from './lib/current-package.mts';
import { setReleaseAs } from './lib/release-as.mts';

const rootDir = fileURLToPath(new URL('../', import.meta.url));

interface Options {
    version?: string;
    remove?: boolean;
}

async function run(names: string[], options: Options): Promise<void> {
    if (!options.remove && !options.version) throw new Error('Give --version <version>, or --remove.');
    if (!names.length) {
        const current = await currentPackageName(rootDir);
        if (!current) program.help({ error: true });
        names = [current];
    }
    await setReleaseAs(rootDir, names, options.remove ? undefined : options.version);
}

program
    .name('release-as')
    .description(
        'Set the version Release Please releases next for packages in release-please-config.json, or remove it.\n' +
            'gen-release-please-config.mts drops it once that version is released.',
    )
    .argument('[packages...]', 'package names, such as @cspell/dict-perl; default: the package in the current folder')
    .option('--version <version>', 'the version to release, such as 1.0.0 or 3.2.0-alpha.0')
    .option('--remove', 'remove `release-as` instead of setting it')
    .action(run);

await program.parseAsync();
