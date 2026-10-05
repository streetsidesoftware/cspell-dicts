import { existsSync, readFileSync, statSync } from 'node:fs';
import { basename, extname, resolve } from 'node:path';

import { localeName } from './locales.mts';

/** A real sample: a file of the kind the dictionary is for, in `samples/`. */
export interface Sample {
    /** Its file name in `samples/`. */
    name: string;
    /** Where the file is on this machine, to copy it. */
    from?: string;
    /** Its text, when it was fetched rather than copied. */
    text?: string;
    /** Where it came from: a URL or a few words. */
    origin?: string;
}

/** The `--add-sample` and `--add-sample-origin` options, as given. */
export interface SampleOptions {
    addSample: string[];
    addSampleOrigin: string[];
}

export const noSampleOptions: SampleOptions = { addSample: [], addSampleOrigin: [] };

/** The sample of words from the sources, checked with the dictionary's locale and file type. */
export const wordSample = 'sample-words-in-dictionary.txt';

/** The files create-dictionary writes in `samples/` itself. */
const written = ['README.md', 'cspell.json', wordSample];

/** The samples given as options, with every file checked. Paths are relative to `cwd`. */
export function parseSamples(options: SampleOptions, cwd: string): Sample[] {
    const samples = new Map<string, Sample>();
    for (const path of options.addSample) addSample(samples, path, cwd);
    for (const value of options.addSampleOrigin) {
        const at = value.indexOf('=');
        if (at < 0) throw new Error(`--add-sample-origin: "${value}" needs <file>=<origin>.`);
        const file = value.slice(0, at);
        const sample = samples.get(file);
        if (!sample) throw new Error(`--add-sample-origin: no sample is named ${file}. Add it with --add-sample.`);
        sample.origin = value.slice(at + 1).trim();
    }
    return [...samples.values()];
}

/** Adds a sample, keyed by its file name in `samples/`. */
export function addSample(samples: Map<string, Sample>, path: string, cwd: string): Sample {
    const valid = checkSample(samples, path, cwd);
    if (valid !== true) throw new Error(`--add-sample: ${valid}`);
    const sample = { name: basename(path), from: resolve(cwd, path) };
    samples.set(sample.name, sample);
    return sample;
}

/** Whether a file can be a sample: true, or why not. */
export function checkSample(samples: Map<string, Sample>, path: string, cwd: string): string | true {
    const file = resolve(cwd, path);
    if (!existsSync(file) || !statSync(file).isFile()) return `${path} not found.`;
    const name = basename(path);
    if (written.includes(name)) return `samples/${name} is written by create-dictionary. Rename the sample.`;
    if (samples.has(name)) return `two samples are named ${name}. Rename one.`;
    return true;
}

/** What's missing from the samples, and why it matters. */
export function sampleWarnings(samples: Sample[], locale: string): string[] {
    if (!samples.length) {
        const language = languageOf(locale);
        return [
            'no samples. A few real files of the kind this dictionary is for show that it works on real text. Add them to samples/.' +
                (language
                    ? ` For a natural language, copy the start of the Wikipedia article on Seattle into samples/seattle.md: ${searchSeattle(language)}`
                    : ''),
        ];
    }
    return samples
        .filter((sample) => !sample.origin)
        .map((sample) => `the sample ${sample.name} has no origin. Give it with --add-sample-origin.`);
}

/** The Wikipedia language code of the first locale, such as `de` for `de-DE`, or undefined for any language. */
export function languageOf(locale: string): string | undefined {
    const language = locale.split(',')[0]?.trim().split(/[-_]/)[0]?.toLowerCase();
    return language && language !== '*' ? language : undefined;
}

/** A search for Seattle on the language's Wikipedia, which finds the article whatever its title. */
function searchSeattle(language: string): string {
    return `https://${language}.wikipedia.org/w/index.php?search=Seattle`;
}

type GetJson = (url: string) => Promise<unknown>;

/**
 * The start of the Wikipedia article on Seattle in a language, as `seattle.md`: its lead section, as plain text. Undefined
 * when it can't be fetched, such as without a network connection, or when the language has no article.
 */
export async function fetchSeattle(language: string, getJson: GetJson = fetchJson): Promise<Sample | undefined> {
    const api = (lang: string, query: string) =>
        `https://${lang}.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&${query}`;
    try {
        const title =
            language === 'en'
                ? 'Seattle'
                : (
                      (await getJson(
                          api('en', `prop=langlinks&titles=Seattle&lllang=${encodeURIComponent(language)}`),
                      )) as Pages
                  ).query?.pages?.[0]?.langlinks?.[0]?.title;
        if (!title) return undefined;
        const query = `prop=extracts&explaintext=1&exintro=1&redirects=1&titles=${encodeURIComponent(title)}`;
        const extract = ((await getJson(api(language, query))) as Pages).query?.pages?.[0]?.extract?.trim();
        if (!extract) return undefined;
        const url = `https://${language}.wikipedia.org/wiki/${encodeURIComponent(title.replaceAll(' ', '_'))}`;
        const text = extract.split(/\n+/).join('\n\n');
        const fetched = new Date().toISOString().slice(0, 10);
        return {
            name: 'seattle.md',
            text: `# [${title}](${url})\n\n${text}\n`,
            origin: `${url}, the start of the article, fetched ${fetched}`,
        };
    } catch {
        return undefined;
    }
}

interface Pages {
    query?: { pages?: { extract?: string; langlinks?: { title?: string }[] }[] };
}

async function fetchJson(url: string): Promise<unknown> {
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'cspell-dicts create-dictionary (https://github.com/streetsidesoftware/cspell-dicts)',
        },
        signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`${url}: ${response.status}`);
    return response.json();
}

/** `samples/README.md`: each sample and its origin. */
export function samplesReadme(friendlyName: string, samples: Sample[]): string {
    const lines = [
        `# ${friendlyName} Samples`,
        '',
        "`pnpm test` spell checks these files with this dictionary. They aren't part of the npm package.",
        '',
        `- \`${wordSample}\`: words from the sources, checked with the dictionary's locale and file type.`,
    ];
    for (const sample of samples) {
        lines.push(`- \`${sample.name}\`: ${sample.origin || 'no known origin'}.`);
    }
    return lines.join('\n') + '\n';
}

/**
 * The first `count` plain words of the built sources, skipping comments, blank lines, and entries with markers. A
 * Hunspell `.dic` file gives its stems.
 */
export function sampleWords(files: string[], count = 50): string[] {
    const words: string[] = [];
    for (const file of files) {
        const hunspell = extname(file) === '.dic';
        const lines = readFileSync(file, 'utf8')
            .split(/\r?\n/)
            .slice(hunspell ? 1 : 0);
        for (const line of lines) {
            const word = (hunspell ? line.split(/[/\s]/)[0] : line).trim();
            if (!/^[\p{L}\p{M}][\p{L}\p{M}\p{N}'’-]*$/u.test(word)) continue;
            if (!words.includes(word)) words.push(word);
            if (words.length >= count) return words;
        }
    }
    return words;
}

/** What samples to add, for this kind of dictionary. */
export function samplesExplanation(locale: string, languageId: string): string[] {
    const language = languageOf(locale);
    const check = "Its tests spell check them with this dictionary, so they're real text it must accept.";
    if (language) {
        const name = localeName(language) ?? language;
        return [`Samples are Markdown files written in ${name}, such as an article or a page of documentation.`, check];
    }
    const types = languageId
        .split(',')
        .map((type) => type.trim())
        .filter((type) => type && type !== '*');
    const files = types.length ? `${types.join(' or ')} files` : 'files of the kind this dictionary is for';
    return [`Samples are ${files} from real projects, such as a short script or a source file.`, check];
}
