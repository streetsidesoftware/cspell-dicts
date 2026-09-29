#!/usr/bin/env node

import { execSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';

import type { Contributor } from './lib/fetch-contributors.mts';
import { fetchContributors, normalizeContributors, sortContributorsByLogin } from './lib/fetch-contributors.mts';

const token = process.argv[2] || process.env['GITHUB_TOKEN'] || (await getToken());

const contributorsFileUrl = new URL('../static/contributors.json', import.meta.url);
const outputFileUrl = new URL('../static/contributors.md', import.meta.url);

async function getToken() {
    const stdout = execSync('gh auth token').toString();
    return stdout.trim();
}

function contributorToMd(contributor: Contributor): string {
    return `[<img alt="Contributor ${contributor.login}" src="${contributor.avatar_url}&size=128" width=64>](${contributor.html_url})`;
}

function contributorsToMd(contributors: Contributor[]): string {
    return (
        '<!--- cspell:disable --->\n\n' +
        contributors.map(contributorToMd).join('\n') +
        '\n\n<!--- cspell:enable --->\n'
    );
}

/**
 * Read the list previous of contributors.
 */
async function readContributors(): Promise<Contributor[]> {
    try {
        const content = await readFile(contributorsFileUrl, 'utf-8');
        return JSON.parse(content);
    } catch {
        return [];
    }
}

/**
 * Write the contributors to the output files.
 */
async function writeContributors(contributors: Contributor[]) {
    await writeFile(outputFileUrl, contributorsToMd(contributors));
    await writeFile(contributorsFileUrl, JSON.stringify(sortContributorsByLogin([...contributors]), null, 2) + '\n');
}

async function run() {
    if (!token) {
        throw new Error('GitHub token is required');
    }

    const previousContributors = await readContributors();
    const currentContributors = normalizeContributors(await fetchContributors(token)).filter((c) => c.type !== 'Bot');

    const byLogin = new Map([...previousContributors, ...currentContributors].map((c) => [c.login, c]));
    const logins = [...new Set([...currentContributors, ...previousContributors].map((c) => c.login))];
    const ordered = new Map(logins.map((login, i) => [login, i]));
    const contributors = [...byLogin.values()].sort(
        (a, b) => (ordered.get(a.login) || 0) - (ordered.get(b.login) || 0),
    );

    await writeContributors(contributors);
}

run();
