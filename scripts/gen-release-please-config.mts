#!/usr/bin/env node

// Writes release-please-config.json from the settings below and every package in the workspace.
// Usage: node scripts/gen-release-please-config.mts [--check]
//   --check: don't write; exit 1 if the committed file is out of date.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { configFile, manifestFile as versionFile, type PackageEntry } from './lib/release-please.mts';

const rootDir = fileURLToPath(new URL('../', import.meta.url));

const configFilePath = path.join(rootDir, configFile);
const versionFilePath = path.join(rootDir, versionFile);

const settings = {
    'bootstrap-sha': '57747d12b18819775592694ea936eb9e4ce875b6',
    'include-v-in-tag': false,
    'tag-separator': '@',
    'prerelease-type': 'alpha',
    prerelease: true,
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
// A package's `release-as`, added by hand, stays until the manifest shows that version was released.
async function genConfig(): Promise<string> {
    const current: Record<string, PackageEntry> =
        JSON.parse(await fs.readFile(configFilePath, 'utf8').catch(() => '{}')).packages ?? {};
    const released: Record<string, string> = JSON.parse(await fs.readFile(versionFilePath, 'utf8').catch(() => '{}'));
    const packages: Record<string, PackageEntry> = {};
    for (const dir of ['.', ...(await findPackageDirs())]) {
        const pkg = JSON.parse(await fs.readFile(path.join(rootDir, dir, 'package.json'), 'utf8'));
        const releaseAs = current[dir]?.['release-as'];
        const keep = releaseAs && released[dir] !== releaseAs;
        packages[dir] = { component: pkg.name, releaseType: 'node', ...(keep && { 'release-as': releaseAs }) };
    }
    return JSON.stringify({ ...settings, packages }, undefined, 4) + '\n';
}

async function genVersionManifest(): Promise<string> {
    const manifest: Record<string, string> = JSON.parse(await fs.readFile(versionFilePath, 'utf8').catch(() => '{}'));
    for (const dir of ['.', ...(await findPackageDirs())]) {
        // Only add new ones
        if (manifest[dir] !== undefined) continue;

        const pkg = JSON.parse(await fs.readFile(path.join(rootDir, dir, 'package.json'), 'utf8'));
        manifest[dir] = pkg.version;
    }
    // const newManifest = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => compare(a, b)));
    const newManifest = manifest;
    return JSON.stringify(newManifest, undefined, 4) + '\n';
}

async function checkConfig(checkOnly: boolean): Promise<boolean> {
    const current = await fs.readFile(configFilePath, 'utf8').catch(() => '');
    const config = await genConfig();

    if (config === current) return true;

    if (checkOnly) {
        console.error('%s is out of date. Run `pnpm run gen:release-please-config`.', configFile);
        return false;
    }

    await fs.writeFile(configFilePath, config);
    console.log('Updated %s', configFile);
    return true;
}

async function checkVersionManifest(readOnly: boolean): Promise<boolean> {
    const current = await fs.readFile(versionFilePath, 'utf8').catch(() => '');
    const manifest = await genVersionManifest();

    if (manifest === current) return true;

    if (readOnly) {
        console.error('%s: version mismatches', versionFile);

        const currentManifest = JSON.parse(current || '{}');
        const newManifest = JSON.parse(manifest);

        for (const key of Object.keys(newManifest)) {
            if (currentManifest[key] !== newManifest[key]) {
                console.error('Mismatch for %s: current=%s, new=%s', key, currentManifest[key], newManifest[key]);
            }
        }
        for (const key of Object.keys(currentManifest)) {
            if (!(key in newManifest)) {
                console.error('Key %s is missing in the new manifest', key);
            }
        }
        return true; // do not update the file when in read-only mode
    }

    await fs.writeFile(versionFilePath, manifest);
    console.log('Updated %s', versionFile);
    return true;
}

async function run(): Promise<void> {
    const check = process.argv.includes('--check');
    const configOk = await checkConfig(check);
    const manifestOk = await checkVersionManifest(check);
    if (!configOk || !manifestOk) {
        process.exitCode = 1;
    }
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
