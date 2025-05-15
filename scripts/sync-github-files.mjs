#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import Path from 'node:path/posix';

import { program } from 'commander';

const syncFileName = '.sync-github-files.json';
const resultsCache = new Map();

let force = false;
let debug = false;

function createHeader(token) {
    return {
        Accept: 'application/vnd.github+json',
        Authorization: token ? `Bearer ${token}` : undefined,
        'X-GitHub-Api-Version': '2022-11-28',
    };
}

async function fetchGithubRest(url, token) {
    const found = resultsCache.get(url.toString().toString());
    if (found) {
        return found;
    }

    const headers = createHeader(token);
    const response = await fetch(url, { headers });
    debug && console.log('Fetch: %o', { url, headers });
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    const data = await response.json();
    resultsCache.set(url.toString(), data);
    return data;
}

function urlGitTree(repo, sha) {
    return `https://api.github.com/repos/${repo}/git/trees/${sha}`;
}

function urlGitReleases(repo) {
    return `https://api.github.com/repos/${repo}/releases`;
}

function urlGithub(repo) {
    return `https://github.com/${repo}`;
}

/**
 *
 * @param {string} repo
 * @param {string} tag
 * @param {*} entry
 * @param {string} token
 * @param {string} outDir
 * @returns
 */
async function syncTreeEntry(entry, token, outDir) {
    if (entry.type === 'blob') {
        await fs.mkdir(outDir, { recursive: true });
        const outputFilePath = Path.join(outDir, entry.path);
        if (!(await shouldSyncFile(outDir, entry))) {
            console.log('file: %s: %s Ok', outputFilePath, entry.sha);
            return;
        }
        const response = await fetchGithubRest(entry.url, token);
        const content = Buffer.from(response.content, 'base64');
        await fs.writeFile(outputFilePath, content);
        await updateSyncFile(outDir, entry);
        console.log('file: %s: %s Update', outputFilePath, entry.sha);
    } else if (entry.type === 'tree') {
        const response = await fetchGithubRest(entry.url, token);
        for (const child of response.tree) {
            child.fullPath = Path.join(entry.fullPath, child.path);
            await syncTreeEntry(child, token, Path.join(outDir, entry.path));
        }
    }
}

async function findTreeEntry(repo, path, token, tag) {
    const rootEntry = {
        path: '',
        type: 'tree',
        sha: tag,
        url: urlGitTree(repo, tag),
    };

    const segments = path.split('/').filter((a) => !!a);

    let current = rootEntry;
    for (const segment of segments) {
        if (current.type !== 'tree') {
            console.error(`Path not found: ${path}`);
            return;
        }
        const response = await fetchGithubRest(current.url, token);
        const entry = response.tree.find((e) => e.path === segment);
        if (!entry) {
            console.error(`Path not found: ${path}`);
            return;
        }
        current = entry;
    }

    return current;
}

async function syncPath(repo, path, token, tag, outDir) {
    const current = await findTreeEntry(repo, path, token, tag);
    // Clear the path for the root entry
    if (current.type === 'tree') {
        current.path = '';
    }
    current.fullPath = path;
    await syncTreeEntry(current, token, outDir);
}

async function shouldSyncFile(outDir, entry) {
    if (force) {
        return true;
    }
    const syncFile = await readSyncFile(outDir);
    return syncFile[entry.fullPath] !== entry.sha;
}

async function syncPaths(repo, paths, options) {
    const { token, output = '.', latest = false } = options;

    const tag = (latest ? await getLatestTag(repo, token) : options.tag) || 'main';

    paths = paths.length > 0 ? paths : [''];

    for (const path of paths) {
        await syncPath(repo, path, token, tag, output);
    }
    await updateSyncFile(output, { fullPath: urlGithub(repo), sha: tag });
}

async function updateSyncFile(outDir, entry) {
    const syncFile = await readSyncFile(outDir);
    syncFile[entry.fullPath] = entry.sha;
    await writeSyncFile(outDir, syncFile);
}

async function readSyncFile(outDir) {
    const syncFilePath = Path.join(outDir, syncFileName);
    try {
        const data = JSON.parse(await fs.readFile(syncFilePath, 'utf-8'));
        return Object.assign(Object.create(null), data);
    } catch {
        return {};
    }
}

async function writeSyncFile(outDir, data) {
    const syncFilePath = Path.join(outDir, syncFileName);
    await fs.mkdir(Path.dirname(syncFilePath), { recursive: true });
    await fs.writeFile(syncFilePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

async function getLatestTag(repo, token) {
    const response = await fetchGithubRest(urlGitReleases(repo), token);
    debug && console.log('Latest tag: %o', response);
    return response?.[0]?.tag_name;
}

program
    .name('sync-github-files')
    .description('Sync files from a GitHub repository.')
    .argument('<repo>', 'GitHub repository in the format <owner>/<repo>')
    .argument('[paths...]', 'Paths to sync.')
    .option('-t, --token <token>', 'GitHub token for authentication')
    .option('-o, --output <path>', 'Output directory for downloaded files (default: current directory)')
    .option('--tag <tag>', 'Tag to sync from (default: main)')
    .option('--latest', 'Use the latest release tag', false)
    .option('--force', 'Force sync even if the file exists', false)
    .option('--debug', 'Enable debug mode', false)
    .action(async (repo, paths, options) => {
        console.log('Syncing files from GitHub: repo: %s%s', repo, paths.length ? `, paths: ${paths}` : '');

        const token = options.token || process.env.GITHUB_TOKEN;
        if (!token) {
            console.error(
                'GitHub token is required. Set it using --token or GITHUB_TOKEN environment variable.\n' +
                    'The command `gh auth token` can be used to get the token.',
            );
            process.exitCode = 1;
            return;
        }

        force = options.force;

        await syncPaths(repo, paths, options);
    });

program.parseAsync();
