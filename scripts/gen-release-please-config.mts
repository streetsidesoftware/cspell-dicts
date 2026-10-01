#!/usr/bin/env node

// Writes release-please-config.json from the settings below and every package in the workspace.
// Usage: node scripts/gen-release-please-config.mts [--check]
//   --check: don't write; exit 1 if the committed file is out of date.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { format, resolveConfig } from 'prettier';

const rootDir = fileURLToPath(new URL('../', import.meta.url));
const configFile = path.join(rootDir, 'release-please-config.json');

const settings = {
    'bootstrap-sha': '57747d12b18819775592694ea936eb9e4ce875b6',
    'include-v-in-tag': false,
    'tag-separator': '@',
    plugins: [
        {
            type: 'node-workspace',
            'always-link-local': true,
            updatePeerDependencies: true,
        },
    ],
    'changelog-sections': [
        { type: 'feat', section: 'Features', hidden: false },
        { type: 'feature', section: 'Features' },
        { type: 'fix', section: 'Updates and Bug Fixes', hidden: false },
        { type: 'perf', section: 'Performance Improvements', hidden: true },
        { type: 'ci', section: 'Continuous Integration', hidden: true },
        { type: 'chore', section: 'Miscellaneous', hidden: true },
        { type: 'revert', section: 'Reverts' },
        { type: 'docs', section: 'Documentation', hidden: true },
        { type: 'style', section: 'Styles', hidden: true },
        { type: 'refactor', section: 'Code Refactoring', hidden: true },
        { type: 'test', section: 'Tests', hidden: true },
        { type: 'build', section: 'Build System', hidden: true },
        { type: '', section: 'Changes', hidden: false },
    ],
};

interface PackageEntry {
    component: string;
    releaseType: 'node';
    prerelease?: boolean;
}

async function findPackageDirs(): Promise<string[]> {
    const dirs: string[] = [];
    for (const parent of ['dictionaries', 'packages']) {
        const entries = await fs.readdir(path.join(rootDir, parent), { withFileTypes: true });
        for (const entry of entries) {
            if (!entry.isDirectory()) continue;
            const dir = `${parent}/${entry.name}`;
            if (await exists(path.join(rootDir, dir, 'package.json'))) dirs.push(dir);
        }
    }
    // Sort by the package.json path, so `en_GB-legacy/` comes before `en_GB/`, as the order has always been.
    return dirs.sort((a, b) => compare(`${a}/package.json`, `${b}/package.json`));
}

// Private packages stay in: when one is released, the node-workspace plugin also releases the packages that
// depend on it, such as the English dictionaries that build from @cspell/aoo-mozilla-en-dict.
// A package new to the config starts with `prerelease: true`. `make-prerelease.mts --remove` takes it off.
async function genConfig(current: string): Promise<string> {
    const existing: Record<string, PackageEntry> | undefined = current ? JSON.parse(current).packages : undefined;
    const packages: Record<string, PackageEntry> = {};
    for (const dir of ['.', ...(await findPackageDirs())]) {
        const pkg = JSON.parse(await fs.readFile(path.join(rootDir, dir, 'package.json'), 'utf8'));
        const prerelease = existing && (existing[dir] ? existing[dir].prerelease : true);
        packages[dir] = { component: pkg.name, releaseType: 'node', ...(prerelease && { prerelease }) };
    }
    const options = await resolveConfig(configFile, { editorconfig: true });
    // Expanded input, because Prettier keeps an object on one line when the input has it on one line.
    return format(JSON.stringify({ ...settings, packages }, undefined, 4), { ...options, filepath: configFile });
}

async function run(): Promise<void> {
    const check = process.argv.includes('--check');
    const current = await fs.readFile(configFile, 'utf8').catch(() => '');
    const config = await genConfig(current);

    if (config === current) return;

    if (check) {
        console.error('release-please-config.json is out of date. Run `pnpm run gen:release-please-config`.');
        process.exitCode = 1;
        return;
    }

    await fs.writeFile(configFile, config);
    console.log('Updated release-please-config.json');
}

async function exists(file: string): Promise<boolean> {
    return fs.stat(file).then(
        () => true,
        () => false,
    );
}

function compare(a: string, b: string): number {
    return a < b ? -1 : a > b ? 1 : 0;
}

await run();
