#!/usr/bin/env node

// Sets or removes a package's `release-as` in release-please-config.json. Run with --help for usage.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { program } from 'commander';
import { format, resolveConfig } from 'prettier';

const rootDir = fileURLToPath(new URL('../', import.meta.url));
const configFile = path.join(rootDir, 'release-please-config.json');

interface PackageEntry {
    component: string;
    'release-as'?: string;
}

interface Options {
    version: string;
    remove?: boolean;
}

async function run(names: string[], options: Options): Promise<void> {
    const config = JSON.parse(await fs.readFile(configFile, 'utf8'));
    const entries = Object.values(config.packages as Record<string, PackageEntry>);

    const unknown = names.filter((name) => !entries.some((e) => e.component === name));
    if (unknown.length) throw new Error(`Not in release-please-config.json: ${unknown.join(', ')}`);

    for (const entry of entries) {
        if (!names.includes(entry.component)) continue;
        if (options.remove) {
            delete entry['release-as'];
        } else {
            entry['release-as'] = options.version;
        }
        console.log(`${entry.component}: ${options.remove ? 'removed release-as' : `release-as ${options.version}`}`);
    }

    const prettierOptions = await resolveConfig(configFile, { editorconfig: true });
    // Expanded input, as in gen-release-please-config.mts.
    const text = await format(JSON.stringify(config, undefined, 4), { ...prettierOptions, filepath: configFile });
    await fs.writeFile(configFile, text);
}

program
    .name('release-as')
    .description(
        'Set the version Release Please releases next for packages in release-please-config.json, or remove it.\n' +
            'gen-release-please-config.mts drops it once that version is released.',
    )
    .argument('<packages...>', 'package names, such as @cspell/dict-perl')
    .option('--version <version>', 'the version to release', '1.0.0')
    .option('--remove', 'remove `release-as` instead of setting it')
    .action(run);

await program.parseAsync();
