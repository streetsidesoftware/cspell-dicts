#!/usr/bin/env node

// Creates a dictionary package in dictionaries/<name>/. Run with --help for usage.

import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { getAnswers } from './lib/answers.mts';
import { createPackage } from './lib/create-package.mts';
import { parseCommandLine } from './lib/options.mts';
import { setUpPackage } from './lib/pnpm.mts';
import { findRepoRoot, openRepo } from './lib/repo.mts';

async function main(): Promise<void> {
    const options = parseCommandLine(process.argv.slice(2));
    // `pnpm run` starts in the repo root; resolve paths from where the command was typed.
    const cwd = process.env.INIT_CWD ?? process.cwd();
    const rootDir = options.root
        ? resolve(cwd, options.root)
        : findRepoRoot(fileURLToPath(new URL('.', import.meta.url)));
    const repo = openRepo(rootDir);
    const settings = await getAnswers(options, repo, cwd);
    const packageDir = createPackage(settings, repo);
    setUpPackage(packageDir, repo, { install: !options.skipInstall, build: settings.doBuild });
}

try {
    await main();
} catch (e) {
    console.error('error: ' + (e instanceof Error ? e.message : String(e)));
    process.exitCode = 1;
}
