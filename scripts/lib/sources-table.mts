import { readFileSync } from 'node:fs';
import { posix } from 'node:path';

import { parse } from 'yaml';

const repoUrl = 'https://github.com/streetsidesoftware/cspell-dicts/blob/main';

/** A file of a source: its path, or its path in the source and its path in `src/<name>/`. */
type SourceFile = string | { path: string; local: string };

/** A source in `src/sources.yaml`, as ADR 0003 of create-dictionary describes it. */
export interface SourceEntry {
    name: string;
    /** `<owner>/<repo>[/<path>]` */
    github?: string;
    /** `<package>[/<path>]`, where a scoped package is `@<scope>/<package>`. */
    npm?: string;
    ref?: string;
    version?: string;
    files?: SourceFile[];
    license?: SourceFile;
    readme?: SourceFile;
    url?: string;
}

/** The sources in a dictionary's `src/sources.yaml`. */
export function readSources(sourcesYaml: string): SourceEntry[] {
    const sources = (parse(readFileSync(sourcesYaml, 'utf8')) as { sources?: SourceEntry[] } | null)?.sources;
    if (!Array.isArray(sources)) throw new Error(`${sourcesYaml}: no list of sources.`);
    for (const source of sources) {
        if (typeof source?.name !== 'string') throw new Error(`${sourcesYaml}: a source has no name.`);
    }
    return sources;
}

/**
 * `static/sources.csv`: each source, where it came from, its license, and how it's updated, as Markdown for
 * `@@inject: ./static/sources.csv#markdown`. `dir` is the dictionary's folder in the repo, such as `dictionaries/de_AR`.
 * Links are absolute, since the README is shown on npm.
 */
export function sourcesCsv(dir: string, sources: SourceEntry[]): string {
    const rows = sources.map((source) => [
        source.name,
        from(source),
        license(dir, source),
        isRemote(source) ? 'weekly, by `pnpm run sync`' : 'by hand',
    ]);
    return [['Source', 'From', 'License', 'Updated'], ...rows].map(csvLine).join('\n') + '\n';
}

function isRemote(source: SourceEntry): boolean {
    return !!(source.github || source.npm);
}

/** Where a source came from: a link to its GitHub folder or npm package, its URL, or unknown. */
function from(source: SourceEntry): string {
    if (source.github) {
        const [owner, repo, ...rest] = source.github.split('/');
        const path = rest.join('/');
        const text = path ? `${owner}/${repo}, ${path}` : `${owner}/${repo}`;
        const tree = path || source.ref ? `/tree/${source.ref ?? 'HEAD'}${path ? '/' + path : ''}` : '';
        return link(text, `https://github.com/${owner}/${repo}${tree}`);
    }
    if (source.npm) {
        const parts = source.npm.split('/');
        // A scoped package's name has two parts, such as @cspell/dict-en_us.
        const nameLength = source.npm.startsWith('@') ? 2 : 1;
        const name = parts.slice(0, nameLength).join('/');
        const path = parts.slice(nameLength).join('/');
        const version = source.version ? `@${source.version}` : '';
        const text = path ? `${name}${version}, ${path}` : `${name}${version}`;
        return link(text, `https://www.npmjs.com/package/${name}${source.version ? `/v/${source.version}` : ''}`);
    }
    return source.url ? `<${source.url}>` : 'unknown';
}

/** A link to a source's license file in the repo, or unknown. */
function license(dir: string, source: SourceEntry): string {
    if (!source.license) return 'unknown';
    const local = typeof source.license === 'string' ? source.license : source.license.local;
    return link(posix.basename(local), `${repoUrl}/${dir}/src/${source.name}/${local}`);
}

function link(text: string, url: string): string {
    return `[${text.replaceAll(/[\\[\]]/g, '\\$&')}](${encodeURI(url)})`;
}

function csvLine(fields: string[]): string {
    return fields.map((field) => (/[",\r\n]/.test(field) ? `"${field.replaceAll('"', '""')}"` : field)).join(',');
}
