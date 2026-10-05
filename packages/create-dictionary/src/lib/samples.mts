import { existsSync, readFileSync, statSync } from 'node:fs';
import { basename, extname, resolve } from 'node:path';

import { IterableHunspellReader } from 'hunspell-reader';

import { hunspellPair } from './hunspell.mts';
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
    addWikipediaSample: string[];
}

export const noSampleOptions: SampleOptions = { addSample: [], addSampleOrigin: [], addWikipediaSample: [] };

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

/** A Wikipedia article: its language, such as `de`, and its title, in that language or in English. */
export interface Article {
    language: string;
    title: string;
}

/**
 * The article a title or URL names. A URL such as `https://de.wikipedia.org/wiki/Berlin` gives its own language and
 * title; a title, such as `Berlin`, is in the dictionary's language.
 */
export function articleOf(titleOrUrl: string, language: string): Article {
    const url = /^https?:\/\/([a-z-]+)\.(?:m\.)?wikipedia\.org\/wiki\/([^?#]+)/i.exec(titleOrUrl.trim());
    if (url) return { language: url[1].toLowerCase(), title: decodeURIComponent(url[2]).replaceAll('_', ' ') };
    return { language, title: titleOrUrl.trim() };
}

/**
 * The start of a Wikipedia article, its lead section as plain text, as a sample named after the title, such as
 * `berlin.md`. The title is looked up in the article's language, then as an English title whose article in that
 * language is used, so `Seattle` finds `סיאטל` in Hebrew, and `Argentina` finds `Argentinien` in German, where
 * `Argentina` is a disambiguation page. Undefined when it can't be fetched, such as without a
 * network connection, or when there's no such article.
 */
export async function fetchArticle(article: Article, getJson: GetJson = fetchJson): Promise<Sample | undefined> {
    const { language } = article;
    const api = (lang: string, query: string) =>
        `https://${lang}.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&${query}`;
    const extractOf = async (title: string) => {
        const query = `prop=extracts|pageprops&ppprop=disambiguation&explaintext=1&exintro=1&redirects=1&titles=${encodeURIComponent(title)}`;
        const page = ((await getJson(api(language, query))) as Pages).query?.pages?.[0];
        const extract = page?.extract?.trim();
        // A disambiguation page, such as Argentina on German Wikipedia, only lists other articles.
        if (!extract || page?.pageprops?.disambiguation !== undefined) return undefined;
        return { title: page?.title ?? title, extract };
    };
    try {
        let found = await extractOf(article.title);
        if (!found && language !== 'en') {
            const query = `prop=langlinks&redirects=1&titles=${encodeURIComponent(article.title)}&lllang=${encodeURIComponent(language)}`;
            const title = ((await getJson(api('en', query))) as Pages).query?.pages?.[0]?.langlinks?.[0]?.title;
            if (title) found = await extractOf(title);
        }
        if (!found) return undefined;
        const url = `https://${language}.wikipedia.org/wiki/${encodeURIComponent(found.title.replaceAll(' ', '_'))}`;
        const text = found.extract.split(/\n+/).join('\n\n');
        const fetched = new Date().toISOString().slice(0, 10);
        return {
            name: sampleName(article.title),
            text: `# [${found.title}](${url})\n\n${text}\n`,
            origin: `${url}, the start of the article, fetched ${fetched}`,
        };
    } catch {
        return undefined;
    }
}

/** The start of the Wikipedia article on Seattle in a language, as `seattle.md`. */
export function fetchSeattle(language: string, getJson: GetJson = fetchJson): Promise<Sample | undefined> {
    return fetchArticle({ language, title: 'Seattle' }, getJson);
}

/** A file name for an article's title: `Brandenburger Tor` gives `brandenburger-tor.md`. */
function sampleName(title: string): string {
    const name = title
        .toLowerCase()
        .replaceAll(/[^\p{L}\p{M}\p{N}]+/gu, '-')
        .replaceAll(/^-|-$/g, '');
    return (name || 'article') + '.md';
}

interface Pages {
    query?: {
        pages?: {
            title?: string;
            extract?: string;
            pageprops?: { disambiguation?: string };
            langlinks?: { title?: string }[];
        }[];
    };
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
 * Up to `count` plain words of the built sources, spread across them, skipping comments and entries with markers. A
 * Hunspell `.dic` file gives its stems, without those its `.aff` file forbids or allows only in compounds.
 */
export async function sampleWords(files: string[], count = 50): Promise<string[]> {
    const words = new Set<string>();
    for (const file of files) {
        const fileWords = extname(file) === '.dic' ? await hunspellWords(file) : listWords(file);
        for (const word of fileWords) words.add(word);
    }
    const all = [...words];
    if (all.length <= count) return all;
    return Array.from({ length: count }, (_, i) => all[Math.floor((i * all.length) / count)]);
}

function isPlainWord(word: string): boolean {
    return /^[\p{L}\p{M}][\p{L}\p{M}\p{N}'’-]*$/u.test(word);
}

function listWords(file: string): string[] {
    return readFileSync(file, 'utf8')
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(isPlainWord);
}

async function hunspellWords(dicFile: string): Promise<string[]> {
    const affFile = hunspellPair(dicFile)[1];
    const { aff } = await IterableHunspellReader.createFromFiles(affFile, dicFile);
    // The reader takes comment lines, which start with a tab or #, as words.
    const dic = decode(readFileSync(dicFile), aff.affInfo.SET)
        .split(/\r?\n/)
        .slice(1)
        .filter((line) => line.trim() && !/^[\s#]/.test(line))
        .map((line) => line.trim());
    return new IterableHunspellReader({ aff, dic })
        .seqAffWords(undefined, 0)
        .filter(({ flags }) => !flags.isForbiddenWord && !flags.isOnlyAllowedInCompound)
        .map(({ word }) => word)
        .filter(isPlainWord)
        .toArray();
}

function decode(buffer: Buffer, encoding = 'UTF-8'): string {
    try {
        return new TextDecoder(encoding).decode(buffer);
    } catch {
        return new TextDecoder().decode(buffer);
    }
}

/** What samples to add, for this kind of dictionary. */
export function samplesExplanation(locale: string, languageId: string): string[] {
    const language = languageOf(locale);
    const check = 'The samples are used with cspell to check that the dictionary works as expected.';
    if (language) {
        const name = localeName(language) ?? language;
        return [
            `Samples should be Markdown files written in ${name}, such as an article or a page of documentation.`,
            check,
        ];
    }
    const types = languageId
        .split(',')
        .map((type) => type.trim())
        .filter((type) => type && type !== '*');
    const files = types.length ? `${types.join(' or ')} files` : 'files of the kind this dictionary is for';
    return [`Samples should be ${files} from real projects, such as a short script or a source file.`, check];
}

/**
 * `samples/cspell.json`: the samples are checked the way users' files are, so they show when the dictionary is enabled.
 * For a natural language, they're in its language, and in English, for the names and loanwords articles quote. The word
 * sample is checked with the dictionary's locale and file type. `words` is for names the samples use.
 */
export function samplesConfig(locale: string, languageId: string): object {
    const language = languageOf(locale);
    return {
        import: ['../cspell-ext.json'],
        // These describe the samples, in English; they aren't samples.
        ignorePaths: ['README.md', 'cspell.json'],
        ...(language && { language: language === 'en' ? locale : `${locale},en` }),
        words: [],
        overrides: [{ filename: wordSample, language: locale, languageId }],
    };
}
