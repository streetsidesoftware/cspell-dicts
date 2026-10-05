import { existsSync, statSync } from 'node:fs';
import { basename, extname, posix, resolve } from 'node:path';

import { hunspellPair, isHunspellFile } from './hunspell.mts';

/** A file of a source: its path in the source, and its path in the source's folder in `src/`. */
export interface SourceFile {
    path: string;
    local: string;
    /** The file is missing: start with an empty word list. */
    empty?: boolean;
}

/**
 * Files to build the dictionary from. A named source is copied into `src/<name>/` and listed in `src/sources.yaml`.
 * A word list given on its own has no name, and is copied into `src/`, where people edit it.
 */
export interface Source {
    name?: string;
    /** The source's folder on this machine. Never recorded. */
    root: string;
    files: SourceFile[];
    license?: SourceFile;
    readme?: SourceFile;
    url?: string;
}

/** The `--define-source` and `--add-source-*` options, as given. */
export interface SourceOptions {
    defineSource: string[];
    addSourceFile: string[];
    addSourceLicense: string[];
    addSourceReadme: string[];
    addSourceUrl: string[];
}

export const noSourceOptions: SourceOptions = {
    defineSource: [],
    addSourceFile: [],
    addSourceLicense: [],
    addSourceReadme: [],
    addSourceUrl: [],
};

const namePattern = /^[\w-]+$/;

/** Whether a file of a source exists, with its pair for a Hunspell file: true, or what's missing. */
export function checkFile(root: string, path: string): string | true {
    const files = isHunspellFile(path) ? hunspellPair(path) : [path];
    const missing = files.filter((file) => !existsSync(resolve(root, file)));
    if (!missing.length) return true;
    const pair = isHunspellFile(path) ? ' A Hunspell file needs both its .dic and .aff files.' : '';
    return `${missing.join(' and ')} not found.${pair}`;
}

/** Whether a folder exists: true, or a message. */
export function checkFolder(root: string, path: string): string | true {
    const folder = resolve(root, path);
    return (existsSync(folder) && statSync(folder).isDirectory()) || `${path} isn't a folder.`;
}

/**
 * The named sources: those already given, such as `hunspell`, then those defined by the options, with every file
 * checked. Paths are relative to `cwd`.
 */
export function parseSources(options: SourceOptions, cwd: string, given: Source[] = []): Source[] {
    const sources = new Map<string, Source>();
    for (const source of given) if (source.name) addSource(sources, { ...source, name: source.name });
    for (const value of options.defineSource) {
        const at = value.indexOf('=');
        const path = at < 0 ? value : value.slice(at + 1);
        const name = at < 0 ? basename(path.replace(/[\\/]+$/, '')) : value.slice(0, at);
        check('--define-source', checkFolder(cwd, path));
        addSource(sources, { name, root: resolve(cwd, path), files: [] });
    }
    for (const value of options.addSourceFile) {
        const { source, local, path } = reference('--add-source-file', value, sources);
        const file = sourceFile(source, path, local);
        check(`--add-source-file ${source.name}`, checkFile(source.root, file.path));
        const pair = isHunspellFile(file.path) ? hunspellPair(file.path) : [file.path];
        for (const each of pair) {
            const withExt = (p: string) => p.slice(0, p.length - extname(p).length) + extname(each);
            const next = isHunspellFile(each) ? { path: withExt(file.path), local: withExt(file.local) } : file;
            if (!source.files.some((f) => f.local === next.local)) source.files.push(next);
        }
    }
    for (const value of options.addSourceLicense) {
        const { source, local, path } = reference('--add-source-license', value, sources);
        source.license = sourceFile(source, path, local);
        check(`--add-source-license ${source.name}`, checkFile(source.root, source.license.path));
    }
    for (const value of options.addSourceReadme) {
        const { source, local, path } = reference('--add-source-readme', value, sources);
        source.readme = sourceFile(source, path, local);
        check(`--add-source-readme ${source.name}`, checkFile(source.root, source.readme.path));
    }
    for (const value of options.addSourceUrl) {
        const { source, path } = reference('--add-source-url', value, sources);
        source.url = path;
    }
    for (const source of sources.values()) {
        if (!source.files.length) {
            throw new Error(
                `the source ${source.name} has no files. Add them with --add-source-file ${source.name}=<path>.`,
            );
        }
    }
    return [...sources.values()];
}

/** A word list given on its own: a source with no name, copied into `src/`. */
export function wordList(file: string, cwd: string, empty: boolean): Source {
    return { root: cwd, files: [{ path: file, local: basename(file), empty }] };
}

/**
 * A Hunspell file given on its own, with its pair: files of the source `hunspell`, so people don't edit them by hand.
 */
export function hunspellFile(file: string, cwd: string): Source {
    check(file, checkFile(cwd, file));
    const files = hunspellPair(file).map((f) => ({ path: f, local: basename(f) }));
    return { name: 'hunspell', root: cwd, files };
}

/** The source's folder in the dictionary, such as `src/hunspell/`. */
export function srcDir(source: Source): string {
    return source.name ? `src/${source.name}/` : 'src/';
}

/** Adds a named source, refusing a bad or repeated name. */
export function addSource(sources: Map<string, Source>, source: Source & { name: string }): void {
    if (!namePattern.test(source.name)) {
        throw new Error(`"${source.name}" can't name a source: use letters, digits, "_", and "-".`);
    }
    if (sources.has(source.name)) {
        throw new Error(`two sources are named ${source.name}. Name one with --define-source <name>=<folder>.`);
    }
    sources.set(source.name, source);
}

/** What's missing from a named source that should be recorded. */
export function sourceWarnings(source: Source): string[] {
    if (!source.name) return [];
    const missing = [
        source.license ? '' : 'license (--add-source-license)',
        source.readme ? '' : 'README (--add-source-readme)',
        source.url ? '' : 'URL (--add-source-url)',
    ].filter((m) => m);
    return missing.length ? [`the source ${source.name} has no ${missing.join(', ')}.`] : [];
}

/** The files of a source the build reads, from the dictionary's folder. */
export function buildFiles(source: Source): string[] {
    return source.files.filter((f) => extname(f.path) !== '.aff').map((f) => srcDir(source) + f.local);
}

/** The files of a source published with the dictionary: its license and README. */
export function publishedFiles(source: Source): string[] {
    return [source.license, source.readme].filter((f) => !!f).map((f) => srcDir(source) + f.local);
}

/** Every file to copy, from where it is on this machine to its path in the dictionary's folder. */
export function copies(source: Source): { from: string; to: string }[] {
    return [...source.files, source.license, source.readme]
        .filter((f): f is SourceFile => !!f && !f.empty)
        .map((f) => ({ from: resolve(source.root, f.path), to: srcDir(source) + f.local }));
}

/** `src/sources.yaml`: each named source, with only its local paths. */
export function sourcesYaml(sources: Source[]): string {
    const quote = (s: string) => `'${s.replaceAll("'", "''")}'`;
    const lines = [
        '# The sources of this dictionary.',
        '# Each source is copied into the folder of its name, next to this file. See README.md.',
        'sources:',
    ];
    for (const source of sources) {
        if (!source.name) continue;
        lines.push(`  - name: ${quote(source.name)}`, '    files:');
        for (const f of source.files) lines.push(`      - ${quote(f.local)}`);
        if (source.license) lines.push(`    license: ${quote(source.license.local)}`);
        if (source.readme) lines.push(`    readme: ${quote(source.readme.local)}`);
        if (source.url) lines.push(`    url: ${quote(source.url)}`);
    }
    return lines.join('\n') + '\n';
}

function reference(option: string, value: string, sources: Map<string, Source>) {
    const at = value.indexOf('=');
    if (at < 0) throw new Error(`${option}: "${value}" needs <name>=<value>.`);
    const left = value.slice(0, at);
    const slash = left.indexOf('/');
    const name = slash < 0 ? left : left.slice(0, slash);
    const source = sources.get(name);
    if (!source) throw new Error(`${option}: no source is named ${name}. Define it with --define-source.`);
    return { source, local: slash < 0 ? undefined : left.slice(slash + 1), path: value.slice(at + 1) };
}

function sourceFile(source: Source, path: string, local: string | undefined): SourceFile {
    const rel = posix.normalize(path.replaceAll('\\', '/'));
    if (rel.startsWith('../') && local === undefined) {
        throw new Error(
            `${path} is outside the source ${source.name}. Give its path in src/${source.name}/: ${source.name}/<path>=${path}.`,
        );
    }
    const loc = posix.normalize((local ?? rel).replaceAll('\\', '/'));
    if (loc.startsWith('../') || loc === '..' || posix.isAbsolute(loc)) {
        throw new Error(`${local} must stay inside src/${source.name}/.`);
    }
    return { path: rel, local: loc };
}

function check(what: string, result: string | true): void {
    if (result !== true) throw new Error(`${what}: ${result}`);
}
