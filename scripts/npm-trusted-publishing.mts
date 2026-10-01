#!/usr/bin/env node

// Sets up npm Trusted Publishing for the public packages in this repo. Run with --help for usage.

import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

import { program } from 'commander';

const rootDir = fileURLToPath(new URL('../', import.meta.url));
const repository = 'streetsidesoftware/cspell-dicts';
const workflowFile = 'publish.yml';
const registry = 'https://registry.npmjs.org';
// npm recommends a pause between trust calls to avoid rate limiting.
const pauseMs = 2000;

interface TrustConfig {
    type?: string;
    file?: string;
    repository?: string;
    permissions?: string[];
}

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
}

function npm(args: string[]): number {
    const result = spawnSync('npm', args, { stdio: 'inherit', shell: process.platform === 'win32' });
    return result.status ?? 1;
}

// npm only prompts for 2FA when stdout is a terminal, so a captured call that needs 2FA is repeated in the terminal
// first. That starts the 5-minute window, and the captured call is retried.
function npmJson(args: string[]): unknown[] {
    for (let attempt = 0; ; ++attempt) {
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

function hasPublisher(configs: TrustConfig[]): boolean {
    return configs.some((c) => c.type === 'github' && c.repository === repository && c.file === workflowFile);
}

async function addTrust(names: string[], dryRun: boolean): Promise<void> {
    for (const name of names) {
        if (!(await fetchLatest(name))) {
            console.log(`${name}: not on npm yet. Publish its first version by hand, then run this again.`);
            continue;
        }
        const configs = listTrust(name);
        await sleep(pauseMs);
        if (hasPublisher(configs)) {
            console.log(`${name}: already trusts ${workflowFile}`);
            continue;
        }
        const args = ['trust', 'github', name, '--file', workflowFile, '--repo', repository];
        args.push('--allow-publish', '--allow-stage-publish', '--yes');
        if (dryRun) args.push('--dry-run');
        if (npm(args) !== 0) throw new Error(`${name}: npm trust github failed`);
        await sleep(pauseMs);
    }
}

async function check(names: string[]): Promise<void> {
    let problems = 0;
    for (const name of names) {
        const latest = await fetchLatest(name);
        if (!latest) {
            console.log(`${name}: not on npm yet`);
            ++problems;
            continue;
        }
        const trusted = hasPublisher(listTrust(name));
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
}

async function run(requested: string[], options: Options): Promise<void> {
    if (options.check && options.mfa) throw new Error('Use either --check or --mfa, not both.');

    const publicPackages = await findPublicPackages();
    const notPublic = requested.filter((name) => !publicPackages.includes(name));
    if (notPublic.length) throw new Error(`Not a public package in this repo: ${notPublic.join(', ')}`);
    const names = requested.length ? requested : publicPackages;

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
    .argument('[packages...]', 'package names; default: every public package under dictionaries/ and packages/')
    .option('--check', "report each package's trusted publisher and how its latest version was published")
    .option('--mfa', 'require 2FA and disallow tokens for publishing each package')
    .option('--dry-run', 'show what would change without changing it')
    .action(run);

await program.parseAsync();
// cspell:ignore EOTP
