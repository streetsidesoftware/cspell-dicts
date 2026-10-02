#!/usr/bin/env node

// Sets up npm Trusted Publishing for the public packages in this repo. Run with --help for usage.

import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

import { program } from 'commander';
import { format } from 'prettier';

import { currentPackageName } from './lib/current-package.mts';

const rootDir = fileURLToPath(new URL('../', import.meta.url));
const repository = 'streetsidesoftware/cspell-dicts';
const workflowFile = 'publish.yml';
const registry = 'https://registry.npmjs.org';
// Packages known to trust publish.yml, so a run can skip them without asking npm.
const publishedFile = path.join(rootDir, 'static/published.json');
// npm recommends a pause between trust calls to avoid rate limiting.
const pauseMs = 1000;

interface TrustConfig {
    type?: string;
    file?: string;
    repository?: string;
    permissions?: string[];
}

interface PublishedEntry {
    trustedPublishing?: boolean;
}

type Published = Record<string, PublishedEntry>;

interface PublishInfo {
    version: string;
    publisher: string;
    oidc: boolean;
}

async function findPublicPackages(): Promise<string[]> {
    const names: string[] = [];
    for (const parent of ['dictionaries', 'packages']) {
        const entries = await fs.readdir(path.join(rootDir, parent), { withFileTypes: true });
        for (const entry of entries) {
            if (!entry.isDirectory()) continue;
            const file = path.join(rootDir, parent, entry.name, 'package.json');
            const pkg = await fs.readFile(file, 'utf8').then(JSON.parse, () => undefined);
            if (pkg?.name && !pkg.private) names.push(pkg.name);
        }
    }
    return names.sort();
}

async function fetchLatest(name: string): Promise<PublishInfo | undefined> {
    console.error('Fetching latest info for %s', name);
    try {
        const response = await fetch(`${registry}/${name.replaceAll('/', '%2f')}/latest`);
        if (response.status === 404) return undefined;
        if (!response.ok) throw new Error(`${name}: registry returned ${response.status}`);
        const manifest = (await response.json()) as {
            version: string;
            _npmUser?: { name?: string; trustedPublisher?: unknown };
        };
        return {
            version: manifest.version,
            publisher: manifest._npmUser?.name ?? 'unknown',
            oidc: Boolean(manifest._npmUser?.trustedPublisher),
        };
    } finally {
        console.error('Fetching latest info for %s, Done.', name);
    }
}

function npm(args: string[]): number {
    console.error('Running npm %s', args.join(' '));
    try {
        const result = spawnSync('npm', args, { stdio: 'inherit', shell: process.platform === 'win32' });
        return result.status ?? 1;
    } finally {
        console.error('Running npm %s, Done.', args.join(' '));
    }
}

// npm only prompts for 2FA when stdout is a terminal, so a captured call that needs 2FA is repeated in the terminal
// first. That starts the 5-minute window, and the captured call is retried.
function npmJson(args: string[]): unknown[] {
    console.error('Running npm %s with JSON output', args.join(' '));
    let attempt = 0;
    try {
        for (; ; ++attempt) {
            const result = spawnSync('npm', [...args, '--json'], {
                stdio: ['inherit', 'pipe', 'pipe'],
                encoding: 'utf8',
                shell: process.platform === 'win32',
            });
            const values = parseJsonValues(result.stdout);
            const error = values.find((v): v is { error: { code?: string } } => isObject(v) && isObject(v.error));
            if (!error && result.status === 0) return values;
            if (error?.error.code === 'EOTP' && attempt === 0) {
                npm(args);
                continue;
            }
            throw new Error(`npm ${args.join(' ')} failed:\n${result.stderr}${result.stdout}`);
        }
    } finally {
        console.error('Running npm %s with JSON output, Done. %d', args.join(' '), attempt);
    }
}

// `npm trust list --json` prints one JSON object per trusted publisher, one after the other, and nothing if none.
function parseJsonValues(text: string): unknown[] {
    const trimmed = text.trim();
    if (!trimmed) return [];
    return JSON.parse(`[${trimmed.replaceAll(/\}\s*\{/g, '},{')}]`);
}

function listTrust(name: string): TrustConfig[] {
    return npmJson(['trust', 'list', name]) as TrustConfig[];
}

async function readPublished(): Promise<Published> {
    return fs.readFile(publishedFile, 'utf8').then(JSON.parse, () => ({}));
}

async function recordTrusted(published: Published, name: string, trusted: boolean): Promise<void> {
    if (!!published[name]?.trustedPublishing === trusted) return;
    published[name] = { ...published[name], trustedPublishing: trusted };
    if (!trusted) delete published[name].trustedPublishing;
    if (!Object.keys(published[name]).length) delete published[name];
    const sorted = Object.fromEntries(Object.entries(published).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
    const text = await format(JSON.stringify(sorted), { filepath: publishedFile });
    await fs.writeFile(publishedFile, text);
}

function hasPublisher(configs: TrustConfig[]): boolean {
    return configs.some((c) => c.type === 'github' && c.repository === repository && c.file === workflowFile);
}

async function addTrust(names: string[], dryRun: boolean): Promise<void> {
    const published = await readPublished();
    for (const name of names) {
        if (published[name]?.trustedPublishing) {
            console.log(`${name}: recorded as trusting ${workflowFile}`);
            continue;
        }
        if (!(await fetchLatest(name))) {
            console.log(`${name}: not on npm yet. Publish its first version by hand, then run this again.`);
            continue;
        }
        const configs = listTrust(name);
        await sleep(pauseMs);
        if (hasPublisher(configs)) {
            console.log(`${name}: already trusts ${workflowFile}`);
            if (!dryRun) await recordTrusted(published, name, true);
            continue;
        }
        const args = ['trust', 'github', name, '--file', workflowFile, '--repo', repository];
        args.push('--allow-publish', '--allow-stage-publish', '--yes');
        if (dryRun) args.push('--dry-run');
        if (npm(args) !== 0) throw new Error(`${name}: npm trust github failed`);
        if (!dryRun) await recordTrusted(published, name, true);
        await sleep(pauseMs);
    }
}

async function check(names: string[]): Promise<void> {
    const published = await readPublished();
    let problems = 0;
    for (const name of names) {
        const latest = await fetchLatest(name);
        if (!latest) {
            console.log(`${name}: not on npm yet`);
            ++problems;
            continue;
        }
        const trusted = hasPublisher(listTrust(name));
        await recordTrusted(published, name, trusted);
        const how = latest.oidc ? 'OIDC' : `token (${latest.publisher})`;
        console.log(`${name}: trusted publisher ${trusted ? 'yes' : 'no'}; ${latest.version} published with ${how}`);
        if (!trusted || !latest.oidc) ++problems;
        await sleep(pauseMs);
    }
    console.log(`${names.length - problems} of ${names.length} packages publish through OIDC.`);
    if (problems) process.exitCode = 1;
}

async function requireMfa(names: string[], dryRun: boolean): Promise<void> {
    for (const name of names) {
        const args = ['access', 'set', 'mfa=publish', name];
        // `npm access` ignores --dry-run.
        if (dryRun) {
            console.log(`Would run: npm ${args.join(' ')}`);
            continue;
        }
        if (npm(args) !== 0) throw new Error(`${name}: npm access set mfa=publish failed`);
        await sleep(pauseMs);
    }
}

interface Options {
    check?: boolean;
    mfa?: boolean;
    dryRun?: boolean;
    all?: boolean;
}

async function run(requested: string[], options: Options): Promise<void> {
    if (options.check && options.mfa) throw new Error('Use either --check or --mfa, not both.');
    if (options.all && requested.length) throw new Error('Use either --all or package names, not both.');
    if (!options.all && !requested.length) {
        const current = await currentPackageName(rootDir);
        if (!current) program.help({ error: true });
        requested = [current];
    }

    const publicPackages = await findPublicPackages();
    const notPublic = requested.filter((name) => !publicPackages.includes(name));
    if (notPublic.length) throw new Error(`Not a public package in this repo: ${notPublic.join(', ')}`);
    const names = options.all ? publicPackages : requested;

    const dryRun = !!options.dryRun;
    if (options.check) return check(names);
    if (options.mfa) return requireMfa(names, dryRun);
    return addTrust(names, dryRun);
}

function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

program
    .name('trusted-publishing')
    .description(
        `Add a trusted publisher for ${workflowFile} to each public package that doesn't have one.\n` +
            'npm asks for 2FA in the browser: choose to skip 2FA for the next 5 minutes, and rerun when the window ends.',
    )
    .argument('[packages...]', 'package names; default: the package in the current folder')
    .option('--all', 'every public package under dictionaries/ and packages/')
    .option('--check', "report each package's trusted publisher and how its latest version was published")
    .option('--mfa', 'require 2FA and disallow tokens for publishing each package')
    .option('--dry-run', 'show what would change without changing it')
    .action(run);

await program.parseAsync();
// cspell:ignore EOTP
