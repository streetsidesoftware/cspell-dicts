#!/usr/bin/env node

// ts-check
import { execSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import Path from 'node:path/posix';
import { formatWithOptions } from 'node:util';

import { Octokit } from '@octokit/core';
import { program } from 'commander';
import globrex from 'globrex';
import assert from 'node:assert';

const syncFileName = '.sync-github-files.json';
const resultsCache = new Map();

let force = false;
let debug = false;
const startTime = performance.now();

function createHeader(token) {
    return {
        Accept: 'application/vnd.github+json',
        Authorization: token ? `Bearer ${token}` : undefined,
        'X-GitHub-Api-Version': '2022-11-28',
    };
}

function log(...args) {
    const deltaTime = (performance.now() - startTime).toFixed(0) + 'ms';
    const message = formatWithOptions({ colors: true }, ...args);
    console.log('%s: %s', deltaTime, message);
}

class FileSync {
    constructor(src) {
        this._cache = new Map(src ? Object.entries(src) : []);
    }

    get(key) {
        return this._cache.get(key);
    }

    set(key, value) {
        this._cache.set(key, value);
    }

    toJSON() {
        return Object.fromEntries(this._cache);
    }

    updateEntry(entry) {
        this._cache.set(entry.fullPath, entry.sha);
    }

    shouldSyncFile(entry) {
        if (force) {
            return true;
        }
        return this._cache.get(entry.fullPath) !== entry.sha;
    }

    static fromJSON(json) {
        return new FileSync(json);
    }
}

function getToken() {
    try {
        const stdout = execSync('gh auth token').toString();
        console.log('Using GitHub token from `gh auth token`');
        return stdout.trim();
    } catch {
        return undefined;
    }
}

/**
 * @typedef {{
 *     path: string,
 *     mode: string,
 *     type: string,
 *     sha: string,
 *     url: string,
 * }} TreeEntry
 */

/**
 *
 * @param {string | URL} url
 * @param {string} token
 * @returns
 */
async function fetchGithubRest(url, token) {
    const found = resultsCache.get(url.toString());
    if (found) {
        return found;
    }

    assert(token, 'Token is required');

    const headers = createHeader(token);
    const response = await fetch(url, { headers });
    debug && log('Fetch: %o', { url, headers });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to fetch ${url}: ${response.statusText} \n${text}`);
    }
    const data = await response.json();
    resultsCache.set(url.toString(), data);

    return data;
}

/**
 *
 * @param {string} ownerRepo
 * @param {string} tree_sha
 * @param {string} token
 * @param {boolean} recursive
 * @returns
 */
async function fetchTree(ownerRepo, tree_sha, token, recursive) {
    const octokit = getOctokit(token);
    const [owner, repo] = ownerRepo.split('/');

    const options = {
        owner,
        repo,
        tree_sha,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28',
        },
    };
    if (recursive) {
        options.recursive = true;
    }

    const result = await octokit.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}', options);

    if (result.status !== 200) {
        throw new Error(`Failed to fetch tree: ${result.statusText}`);
    }
    return result.data;
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
 * @param {TreeEntry} entry
 * @param {string} token
 * @param {string} outDir
 * @returns
 */
async function* walkTree(entry, token, outDir) {
    if (entry.type === 'blob') {
        yield { entry, outDir };
        return;
    }
    if (entry.type === 'tree') {
        const response = await fetchGithubRest(entry.url, token);
        debug && log('response: %o', response);
        for (const child of response.tree) {
            child.fullPath = Path.join(entry.fullPath, child.path);
            yield* walkTree(child, token, Path.join(outDir, entry.path));
        }
    }
}

/**
 *
 * @param {string} repo
 * @param {string} path
 * @param {string} token
 * @param {string} tag
 * @returns Promise<TreeEntry | undefined>
 */
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

    // Clear the path for the root entry
    if (current.type === 'tree') {
        current.path = '';
    }
    current.fullPath = path;

    return current;
}

/**
 *
 * @param {string} repo
 * @param {string} path
 * @param {string} token
 * @param {string} tag
 * @returns Promise<TreeEntry[] | undefined>
 */
async function findTreeEntriesRecursive(repo, path, token, tag) {
    const response = await fetchTree(repo, tag, token, true);

    // log('findTreeEntriesRecursive: %o', { repo, path, tag, response });

    if (response.truncated) {
        return;
    }

    const dirPath = path ? (path.endsWith('/') ? path : path + '/') : '';

    const entries = response.tree
        .filter((entry) => entry.type !== 'tree')
        .filter((entry) => !path || entry.path.startsWith(dirPath) || entry.path === path);
    const found = entries.map((entry) => {
        entry.fullPath = entry.path;
        entry.path = entry.path.slice(dirPath.length);
        return entry;
    });

    return found;
}

/**
 *
 * @param {string} repo
 * @param {string} path
 * @param {string} token
 * @param {string} tag
 * @returns Promise<TreeEntry[] | undefined>
 */
async function findTreeEntries(repo, path, token, tag) {
    const treeRootEntries = await findTreeEntriesRecursive(repo, path, token, tag);
    if (treeRootEntries?.length > 1) {
        return treeRootEntries;
    }
    const rootEntry = await findTreeEntry(repo, path, token, tag);
    return rootEntry ? [rootEntry] : undefined;
}

/**
 *
 * @param {string} repo
 * @param {string} path
 * @param {string} token
 * @param {string} tag
 * @param {string} rootOutDir
 * @param {(path: string) => boolean} filter
 * @param {FileSync} fileSync
 */
async function syncPath(repo, path, token, tag, rootOutDir, filter, fileSync) {
    assert(token, 'Token is required');
    const treeRootEntries = await findTreeEntries(repo, path, token, tag);

    if (!treeRootEntries) {
        return;
    }

    for (const treeEntry of treeRootEntries) {
        for await (const { entry, outDir } of walkTree(treeEntry, token, rootOutDir)) {
            const startTime = performance.now();
            if (!filter(entry.fullPath)) {
                // log('file: %s: %s Skip', entry.path, entry.sha);
                continue;
            }
            assert(entry.type === 'blob');
            const outputFilePath = Path.join(outDir, entry.path);
            if (!fileSync.shouldSyncFile(entry)) {
                const deltaTime = (performance.now() - startTime).toFixed(3) + 'ms';
                log('file: %s: \t%s %s Ok', outputFilePath, entry.sha, deltaTime);
                continue;
            }
            const response = await fetchGithubRest(entry.url, token);
            const content = Buffer.from(response.content, 'base64');
            await fs.mkdir(Path.dirname(outputFilePath), { recursive: true });
            await fs.writeFile(outputFilePath, content);
            fileSync.updateEntry(entry);
            log('file: %s: %s Update', outputFilePath, entry.sha);
        }
    }
}

/**
 *
 * @param {string} repo
 * @param {string[]} paths
 * @param {Options} options
 */
async function syncPaths(repo, paths, options) {
    const { token, output = '.', latest = false, filter } = options;

    const syncFile = await readSyncFile(output);

    assert(repo, 'Repository is required');
    assert(token, 'Token is required');

    const tag = (latest ? await getLatestTag(repo, token) : options.tag) || 'main';

    paths = paths.length > 0 ? paths : [''];

    const filterRegExps = filter?.map((f) => globrex(f, { globstar: true, extended: true }).regex);
    const filterFn = filterRegExps?.length ? (path) => filterRegExps.some((regexp) => regexp.test(path)) : () => true;

    for (const path of paths) {
        await syncPath(repo, path, token, tag, output, filterFn, syncFile);
    }

    syncFile.set(urlGithub(repo), tag);
    await writeSyncFile(output, syncFile);
}

/**
 *
 * @param {string} outDir
 * @returns {Promise<FileSync>}
 */
async function readSyncFile(outDir) {
    const syncFilePath = Path.join(outDir, syncFileName);
    try {
        const data = JSON.parse(await fs.readFile(syncFilePath, 'utf-8'));
        return FileSync.fromJSON(data);
    } catch {
        return new FileSync();
    }
}

/**
 *
 * @param {string} outDir
 * @param {FileSync} data
 */
async function writeSyncFile(outDir, data) {
    const syncFilePath = Path.join(outDir, syncFileName);
    await fs.mkdir(Path.dirname(syncFilePath), { recursive: true });
    await fs.writeFile(syncFilePath, JSON.stringify(data, null, 4) + '\n', 'utf-8');
}

/**
 *
 * @param {string} repo
 * @param {string} token
 * @returns
 */
async function getLatestTag(repo, token) {
    const response = await fetchGithubRest(urlGitReleases(repo), token);
    debug && log('Latest tag: %o', response);
    return response?.[0]?.tag_name;
}

let octokit = undefined;
function getOctokit(token) {
    console.assert(token, 'Token is required');
    if (!octokit) {
        octokit = new Octokit({ auth: token });
    }
    return octokit;
}

/**
 * @typedef {{
 *      token: string | undefined,
 *      output: string | undefined,
 *      tag: string | undefined,
 *      latest: boolean,
 *      filter: string[] | undefined,
 *  }} Options
 */

program
    .name('sync-github-files')
    .description('Sync files from a GitHub repository.')
    .argument('<repo>', 'GitHub repository in the format <owner>/<repo>')
    .argument('[paths...]', 'Paths to sync.')
    .option('-t, --token <token>', 'GitHub token for authentication')
    .option('-o, --output <path>', 'Output directory for downloaded files (default: current directory)')
    .option('--tag <tag>', 'Tag to sync from (default: main)')
    .option('--latest', 'Use the latest release tag', false)
    .option('--filter <glob>', 'Filter files to sync using a glob pattern.', (value, prev) =>
        prev ? [...prev, value] : [value],
    )
    .option('--force', 'Force sync even if the file exists', false)
    .option('--debug', 'Enable debug mode', false)
    .action(async (repo, paths, options) => {
        console.log('Syncing files from GitHub: repo: %s%s', repo, paths.length ? `, paths: ${paths}` : '');

        options.token ??= process.env.GITHUB_TOKEN || getToken();
        const token = options.token;
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
