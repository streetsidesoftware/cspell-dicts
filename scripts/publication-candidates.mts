#!/usr/bin/env node

// Lists the private dictionaries to open a publication PR for. Run with --help for usage.

import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { program } from 'commander';

import {
    type PublicationCandidate,
    publicationBranch,
    publicationCandidates,
    publishedFile,
    readDictionaryPackages,
    readPublished,
    readReleaseComponents,
} from './lib/publication.mts';

const rootDir = fileURLToPath(new URL('../', import.meta.url));
const repository = 'streetsidesoftware/cspell-dicts';

interface Options {
    githubOutput?: boolean;
}

async function run(select: string | undefined, options: Options): Promise<void> {
    const packages = await readDictionaryPackages();
    let candidates = publicationCandidates(
        packages,
        await readPublished(rootDir),
        await readReleaseComponents(rootDir),
    );

    if (select) {
        const found = packages.find((p) => p.dir === select || p.name === select);
        if (!found) throw new Error(`Not a dictionary package in this repo: ${select}`);
        candidates = candidates.filter((c) => c.name === found.name);
        if (!candidates.length)
            console.error('Skipping %s: it is public, never to be published, or not released.', select);
    }

    const ready: PublicationCandidate[] = [];
    for (const c of candidates) {
        if (await hasOpenPr(publicationBranch(c.dir))) {
            console.error('Skipping %s: %s has an open PR.', c.name, publicationBranch(c.dir));
        } else {
            ready.push(c);
        }
    }

    const json = JSON.stringify(ready);
    console.log(json);
    if (options.githubOutput) {
        const file = process.env.GITHUB_OUTPUT;
        if (!file) throw new Error('--github-output: GITHUB_OUTPUT is not set.');
        await fs.appendFile(file, `dictionaries=${json}\n`, 'utf8');
    }
}

async function hasOpenPr(branch: string): Promise<boolean> {
    const [owner] = repository.split('/');
    const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const url = `https://api.github.com/repos/${repository}/pulls?state=open&head=${owner}:${branch}`;
    const response = await fetch(url, { headers });
    if (!response.ok) throw new Error(`GitHub API returned ${response.status} for ${url}`);
    return ((await response.json()) as unknown[]).length > 0;
}

program
    .name('publication-candidates')
    .description(
        'Print, as a JSON array, the private dictionaries to open a publication PR for: each one that\n' +
            `${publishedFile} doesn't mark false, that is in release-please-config.json, and whose PR isn't open.\n` +
            'Sends GITHUB_TOKEN to the GitHub API if set.',
    )
    .argument('[dictionary]', 'only this dictionary: its directory under dictionaries/, or its package name')
    .option('--github-output', 'also write the array to $GITHUB_OUTPUT as "dictionaries"')
    .action(run);

await program.parseAsync();
