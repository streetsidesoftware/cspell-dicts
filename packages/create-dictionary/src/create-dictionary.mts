#!/usr/bin/env node

// Creates a dictionary package in dictionaries/<name>/. Run with --help for usage.

import { relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { getAnswers, type Settings } from './lib/answers.mts';
import { isHunspellFile } from './lib/hunspell.mts';
import { createPackage } from './lib/create-package.mts';
import { parseCommandLine } from './lib/options.mts';
import { setUpPackage } from './lib/pnpm.mts';
import { findRepoRoot, openRepo } from './lib/repo.mts';
import { fail, heading, note } from './lib/style.mts';

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
    if (!settings.doBuild) console.log(notBuilt(relative(rootDir, packageDir), settings));
}

function notBuilt(dir: string, settings: Settings): string {
    const lines = [`${heading('Not built yet.')} Its tests fail until you run pnpm run build in ${dir}.`];
    if (settings.sources.some((s) => s.files.some((f) => isHunspellFile(f.path)))) {
        lines.push(
            `A Hunspell dictionary can take a long time to build. If it's too slow, lower maxDepth in ${dir}/cspell-tools.config.yaml.`,
        );
    }
    return lines.join('\n');
}

try {
    await main();
} catch (e) {
    // Ctrl+C at a prompt.
    if (e instanceof Error && e.name === 'ExitPromptError') console.error(note('Stopped. Nothing was written.'));
    else fail(e instanceof Error ? e.message : String(e));
    process.exitCode = 1;
}
