import { existsSync, statSync } from 'node:fs';
import { basename, extname, posix, resolve } from 'node:path';

import { hunspellPair, isHunspellFile } from './source.mts';

/** A file of a third-party source: its path in the source, and its path in `src/<name>/`. */
export interface SourceFile {
    path: string;
    local: string;
}

export interface ThirdPartySource {
    name: string;
    /** The source's folder on this machine. Never recorded. */
    root: string;
    files: SourceFile[];
    license?: SourceFile;
    readme?: SourceFile;
    url?: string;
}

/** The `--define-source` and `--add-source-*` options, as given. */
export interface ThirdPartyOptions {
    defineSource: string[];
    addSourceFile: string[];
    addSourceLicense: string[];
    addSourceReadme: string[];
    addSourceUrl: string[];
}

export const noThirdParty: ThirdPartyOptions = {
    defineSource: [],
    addSourceFile: [],
    addSourceLicense: [],
    addSourceReadme: [],
    addSourceUrl: [],
};

const namePattern = /^[\w-]+$/;

/**
 * The third-party sources defined by the options, with every file checked. Paths are relative to `cwd`.
 */
export function parseThirdParty(options: ThirdPartyOptions, cwd: string): ThirdPartySource[] {
    const sources = new Map<string, ThirdPartySource>();
    for (const value of options.defineSource) {
        const at = value.indexOf('=');
        const path = at < 0 ? value : value.slice(at + 1);
        const name = at < 0 ? basename(path.replace(/[\\/]+$/, '')) : value.slice(0, at);
        const root = resolve(cwd, path);
        if (!existsSync(root) || !statSync(root).isDirectory()) {
            throw new Error(`--define-source: ${path} isn't a folder.`);
        }
        addSource(sources, { name, root, files: [] });
    }
    for (const value of options.addSourceFile) {
        const { source, local, path } = reference('--add-source-file', value, sources);
        const file = sourceFile(source, path, local);
        const pair = isHunspellFile(file.path) ? hunspellPair(file.path) : [file.path];
        for (const each of pair) {
            const withExt = (p: string) => p.slice(0, p.length - extname(p).length) + extname(each);
            const next = isHunspellFile(each) ? { path: withExt(file.path), local: withExt(file.local) } : file;
            checkExists(source, next.path);
            if (!source.files.some((f) => f.local === next.local)) source.files.push(next);
        }
    }
    for (const value of options.addSourceLicense) {
        const { source, local, path } = reference('--add-source-license', value, sources);
        source.license = sourceFile(source, path, local);
        checkExists(source, source.license.path);
    }
    for (const value of options.addSourceReadme) {
        const { source, local, path } = reference('--add-source-readme', value, sources);
        source.readme = sourceFile(source, path, local);
        checkExists(source, source.readme.path);
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

/**
 * A Hunspell file given as a dictionary source: a third-party source named after the file, from its folder.
 */
export function hunspellShortcut(file: string, cwd: string): ThirdPartySource {
    const path = resolve(cwd, file);
    const dic = basename(hunspellPair(path)[0]);
    const name = dic.slice(0, -extname(dic).length);
    if (!namePattern.test(name)) {
        throw new Error(`${file}: "${name}" can't name a source. Use --define-source <name>=<folder> instead.`);
    }
    const files = hunspellPair(dic).map((f) => ({ path: f, local: f }));
    return { name, root: resolve(path, '..'), files };
}

/** Adds a source, refusing a bad or repeated name. */
export function addSource(sources: Map<string, ThirdPartySource>, source: ThirdPartySource): void {
    if (!namePattern.test(source.name)) {
        throw new Error(`"${source.name}" can't name a source: use letters, digits, "_", and "-".`);
    }
    if (sources.has(source.name)) {
        throw new Error(`two sources are named ${source.name}. Name one with --define-source <name>=<path>.`);
    }
    sources.set(source.name, source);
}

/** What's missing from a source that should be recorded. */
export function sourceWarnings(source: ThirdPartySource): string[] {
    const missing = [
        source.license ? '' : 'license (--add-source-license)',
        source.readme ? '' : 'README (--add-source-readme)',
        source.url ? '' : 'URL (--add-source-url)',
    ].filter((m) => m);
    return missing.length ? [`the source ${source.name} has no ${missing.join(', ')}.`] : [];
}

/** The files of a source the build reads, from the dictionary's folder. */
export function buildFiles(source: ThirdPartySource): string[] {
    return source.files.filter((f) => extname(f.path) !== '.aff').map((f) => `src/${source.name}/${f.local}`);
}

/** The files of a source published with the dictionary: its license and README. */
export function publishedFiles(source: ThirdPartySource): string[] {
    return [source.license, source.readme].filter((f) => !!f).map((f) => `src/${source.name}/${f.local}`);
}

/** Every file to copy, from where it is on this machine to its path in the dictionary's folder. */
export function copies(source: ThirdPartySource): { from: string; to: string }[] {
    return [...source.files, source.license, source.readme]
        .filter((f) => !!f)
        .map((f) => ({ from: resolve(source.root, f.path), to: `src/${source.name}/${f.local}` }));
}

/** `src/sources.yaml` for local sources: each lists only its local paths. */
export function sourcesYaml(sources: ThirdPartySource[]): string {
    const quote = (s: string) => `'${s.replaceAll("'", "''")}'`;
    const lines = [
        '# The sources of this dictionary.',
        '# Each source is copied into the folder of its name, next to this file. See README.md.',
        'sources:',
    ];
    for (const source of sources) {
        lines.push(`  - name: ${quote(source.name)}`, '    files:');
        for (const f of source.files) lines.push(`      - ${quote(f.local)}`);
        if (source.license) lines.push(`    license: ${quote(source.license.local)}`);
        if (source.readme) lines.push(`    readme: ${quote(source.readme.local)}`);
        if (source.url) lines.push(`    url: ${quote(source.url)}`);
    }
    return lines.join('\n') + '\n';
}

function reference(option: string, value: string, sources: Map<string, ThirdPartySource>) {
    const at = value.indexOf('=');
    if (at < 0) throw new Error(`${option}: "${value}" needs <name>=<value>.`);
    const left = value.slice(0, at);
    const slash = left.indexOf('/');
    const name = slash < 0 ? left : left.slice(0, slash);
    const source = sources.get(name);
    if (!source) throw new Error(`${option}: no source is named ${name}. Define it with --define-source.`);
    return { source, local: slash < 0 ? undefined : left.slice(slash + 1), path: value.slice(at + 1) };
}

function sourceFile(source: ThirdPartySource, path: string, local: string | undefined): SourceFile {
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

function checkExists(source: ThirdPartySource, path: string): void {
    if (!existsSync(resolve(source.root, path))) {
        throw new Error(`the source ${source.name} has no ${path}.`);
    }
}
