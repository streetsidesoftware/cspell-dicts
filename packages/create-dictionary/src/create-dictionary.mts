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
import { fail, heading, info, literal, stopped } from './lib/output.mts';

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
    nextSteps(relative(cwd, packageDir) || '.', settings);
}

/** What to do now: go to the dictionary, and build it if the command didn't. */
function nextSteps(dir: string, settings: Settings): void {
    const steps = [`cd ${dir}`, ...(settings.doBuild ? [] : ['pnpm run build'])];
    info('\n%s\n%s', heading('Next steps:'), steps.map((step) => '  ' + literal(step)).join('\n'));
    if (!settings.doBuild) {
        info("Its tests fail until it's built.");
        if (settings.sources.some((s) => s.files.some((f) => isHunspellFile(f.path)))) {
            info(
                "A Hunspell dictionary can take a long time to build. If it's too slow, lower %s in %s.",
                literal('maxDepth'),
                literal('cspell-tools.config.yaml'),
            );
        }
    }
}

try {
    await main();
} catch (e) {
    // Ctrl+C at a prompt.
    if (e instanceof Error && e.name === 'ExitPromptError') stopped();
    else fail(e instanceof Error ? e.message : String(e));
    process.exitCode = 1;
}
