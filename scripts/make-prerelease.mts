#!/usr/bin/env node

// Sets or removes `prerelease: true` for packages in release-please-config.json. Run with --help for usage.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { program } from 'commander';
import { format, resolveConfig } from 'prettier';

const rootDir = fileURLToPath(new URL('../', import.meta.url));
const configFile = path.join(rootDir, 'release-please-config.json');

interface PackageEntry {
    component: string;
    prerelease?: boolean;
}

interface Options {
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
            delete entry.prerelease;
        } else {
            entry.prerelease = true;
        }
        console.log(`${entry.component}: ${options.remove ? 'removed prerelease' : 'prerelease: true'}`);
    }

    const prettierOptions = await resolveConfig(configFile, { editorconfig: true });
    // Expanded input, as in gen-release-please-config.mts.
    const text = await format(JSON.stringify(config, undefined, 4), { ...prettierOptions, filepath: configFile });
    await fs.writeFile(configFile, text);
}

program
    .name('make-prerelease')
    .description('Set `prerelease: true` for packages in release-please-config.json, or remove it with --remove.')
    .argument('<packages...>', 'package names, such as @cspell/dict-git')
    .option('--remove', 'remove `prerelease: true` instead of setting it')
    .action(run);

await program.parseAsync();
