#!/usr/bin/env node

import { execSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import Path from 'node:path/posix';
import { formatWithOptions } from 'node:util';

import { Octokit } from '@octokit/core';
import { program } from 'commander';
import globrex from 'globrex';
import assert from 'node:assert';

const syncFileName = '.sync-github-files.json';
const resultsCache = new Map<string, unknown>();

let force = false;
let debug = false;
const startTime = performance.now();

function createHeader(token: string): Record<string, string> {
    return {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
    };
}

function log(format: string, ...args: unknown[]) {
    const deltaTime = (performance.now() - startTime).toFixed(0) + 'ms';
    const message = formatWithOptions({ colors: true }, format, ...args);
    console.log('%s: %s', deltaTime, message);
}

class FileSync {
    private _cache: Map<string, string>;

    constructor(src?: Record<string, string>) {
        this._cache = new Map(src ? Object.entries(src) : []);
    }

    get(key: string): string | undefined {
        return this._cache.get(key);
    }

    set(key: string, value: string): void {
        this._cache.set(key, value);
    }

    toJSON(): Record<string, string> {
        return Object.fromEntries(this._cache);
    }

    updateEntry(entry: FullTreeEntry): void {
        this._cache.set(entry.fullPath, entry.sha);
    }

    shouldSyncFile(entry: FullTreeEntry): boolean {
        if (force) {
            return true;
        }
        return this._cache.get(entry.fullPath) !== entry.sha;
    }

    static fromJSON(json: Record<string, string>): FileSync {
        return new FileSync(json);
    }
}

function getToken(): string | undefined {
    try {
        const stdout = execSync('gh auth token').toString();
        console.log('Using GitHub token from `gh auth token`');
        return stdout.trim();
    } catch {
        return undefined;
    }
}

interface TreeEntry {
    path: string;
    mode?: string;
    type: string;
    sha: string;
    url: string;
}

/** A tree entry with its path from the root of the repository. */
interface FullTreeEntry extends TreeEntry {
    fullPath: string;
}

interface TreeResponse {
    tree: TreeEntry[];
}

interface BlobResponse {
    content: string;
}

interface Release {
    tag_name: string;
}

async function fetchGithubRest<T>(url: string | URL, token: string): Promise<T> {
    const found = resultsCache.get(url.toString());
    if (found) {
        return found as T;
    }

    assert(token, 'Token is required');

    const headers = createHeader(token);
    const response = await fetch(url, { headers });
    if (debug) log('Fetch: %o', { url, headers });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to fetch ${url}: ${response.statusText} \n${text}`);
    }
    const data = (await response.json()) as T;
    resultsCache.set(url.toString(), data);

    return data;
}

async function fetchTree(ownerRepo: string, tree_sha: string, token: string, recursive: boolean) {
    const octokit = getOctokit(token);
    const [owner, repo] = ownerRepo.split('/');

    const options: {
        owner: string;
        repo: string;
        tree_sha: string;
        headers: Record<string, string>;
        recursive?: string;
    } = {
        owner,
        repo,
        tree_sha,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28',
        },
    };
    if (recursive) {
        // GitHub returns the whole tree when `recursive` has any value.
        options.recursive = 'true';
    }

    const result = await octokit.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}', options);

    if (result.status !== 200) {
        throw new Error(`Failed to fetch tree: ${result.status}`);
    }
    return result.data;
}

function urlGitTree(repo: string, sha: string): string {
    return `https://api.github.com/repos/${repo}/git/trees/${sha}`;
}

function urlGitReleases(repo: string): string {
    return `https://api.github.com/repos/${repo}/releases`;
}

function urlGithub(repo: string): string {
    return `https://github.com/${repo}`;
}

async function* walkTree(
    entry: FullTreeEntry,
    token: string,
    outDir: string,
): AsyncGenerator<{ entry: FullTreeEntry; outDir: string }> {
    if (entry.type === 'blob') {
        yield { entry, outDir };
        return;
    }
    if (entry.type === 'tree') {
        const response = await fetchGithubRest<TreeResponse>(entry.url, token);
        if (debug) log('response: %o', response);
        for (const child of response.tree as FullTreeEntry[]) {
            child.fullPath = Path.join(entry.fullPath, child.path);
            yield* walkTree(child, token, Path.join(outDir, entry.path));
        }
    }
}

async function findTreeEntry(
    repo: string,
    path: string,
    token: string,
    tag: string,
): Promise<FullTreeEntry | undefined> {
    const rootEntry: TreeEntry = {
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
        const response = await fetchGithubRest<TreeResponse>(current.url, token);
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
    const found = current as FullTreeEntry;
    found.fullPath = path;

    return found;
}

async function findTreeEntriesRecursive(
    repo: string,
    path: string,
    token: string,
    tag: string,
): Promise<FullTreeEntry[] | undefined> {
    const response = await fetchTree(repo, tag, token, true);

    // log('findTreeEntriesRecursive: %o', { repo, path, tag, response });

    if (response.truncated) {
        return;
    }

    const dirPath = path ? (path.endsWith('/') ? path : path + '/') : '';

    const entries = (response.tree as FullTreeEntry[])
        .filter((entry) => entry.type !== 'tree')
        .filter((entry) => !path || entry.path.startsWith(dirPath) || entry.path === path);
    const found = entries.map((entry) => {
        entry.fullPath = entry.path;
        entry.path = entry.path.slice(dirPath.length);
        return entry;
    });

    return found;
}

async function findTreeEntries(
    repo: string,
    path: string,
    token: string,
    tag: string,
): Promise<FullTreeEntry[] | undefined> {
    const treeRootEntries = await findTreeEntriesRecursive(repo, path, token, tag);
    if ((treeRootEntries?.length ?? 0) > 1) {
        return treeRootEntries;
    }
    const rootEntry = await findTreeEntry(repo, path, token, tag);
    return rootEntry ? [rootEntry] : undefined;
}

async function syncPath(
    repo: string,
    path: string,
    token: string,
    tag: string,
    rootOutDir: string,
    filter: (path: string) => boolean,
    fileSync: FileSync,
) {
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
            const response = await fetchGithubRest<BlobResponse>(entry.url, token);
            const content = Buffer.from(response.content, 'base64');
            await fs.mkdir(Path.dirname(outputFilePath), { recursive: true });
            await fs.writeFile(outputFilePath, content);
            fileSync.updateEntry(entry);
            log('file: %s: %s Update', outputFilePath, entry.sha);
        }
    }
}

async function syncPaths(repo: string, paths: string[], options: Options) {
    const { token, output = '.', latest = false, filter } = options;

    const syncFile = await readSyncFile(output);

    assert(repo, 'Repository is required');
    assert(token, 'Token is required');

    const tag = (latest ? await getLatestTag(repo, token) : options.tag) || 'main';

    paths = paths.length > 0 ? paths : [''];

    const filterRegExps = filter?.map((f) => globrex(f, { globstar: true, extended: true }).regex);
    const filterFn = filterRegExps?.length
        ? (path: string) => filterRegExps.some((regexp) => regexp.test(path))
        : () => true;

    for (const path of paths) {
        await syncPath(repo, path, token, tag, output, filterFn, syncFile);
    }

    syncFile.set(urlGithub(repo), tag);
    await writeSyncFile(output, syncFile);
}

async function readSyncFile(outDir: string): Promise<FileSync> {
    const syncFilePath = Path.join(outDir, syncFileName);
    try {
        const data = JSON.parse(await fs.readFile(syncFilePath, 'utf-8'));
        return FileSync.fromJSON(data);
    } catch {
        return new FileSync();
    }
}

async function writeSyncFile(outDir: string, data: FileSync) {
    const syncFilePath = Path.join(outDir, syncFileName);
    await fs.mkdir(Path.dirname(syncFilePath), { recursive: true });
    await fs.writeFile(syncFilePath, JSON.stringify(data, null, 4) + '\n', 'utf-8');
}

async function getLatestTag(repo: string, token: string): Promise<string | undefined> {
    const response = await fetchGithubRest<Release[] | undefined>(urlGitReleases(repo), token);
    if (debug) log('Latest tag: %o', response);
    return response?.[0]?.tag_name;
}

let octokit: Octokit | undefined = undefined;
function getOctokit(token: string): Octokit {
    console.assert(token, 'Token is required');
    if (!octokit) {
        octokit = new Octokit({ auth: token });
    }
    return octokit;
}

interface Options {
    token: string | undefined;
    output: string | undefined;
    tag: string | undefined;
    latest: boolean;
    filter: string[] | undefined;
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
    .option('--filter <glob>', 'Filter files to sync using a glob pattern.', (value: string, prev?: string[]) =>
        prev ? [...prev, value] : [value],
    )
    .option('--force', 'Force sync even if the file exists', false)
    .option('--debug', 'Enable debug mode', false)
    .action(async (repo: string, paths: string[], options: Options & { force: boolean; debug: boolean }) => {
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
        debug = options.debug;

        await syncPaths(repo, paths, options);
    });

program.parseAsync();
