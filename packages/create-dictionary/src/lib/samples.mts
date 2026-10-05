import { existsSync, readFileSync, statSync } from 'node:fs';
import { basename, extname, resolve } from 'node:path';

/** A real sample: a file of the kind the dictionary is for, copied into `samples/`. */
export interface Sample {
    /** Where the file is on this machine. */
    path: string;
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
    const sample = { path: resolve(cwd, path) };
    samples.set(basename(path), sample);
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
        const article = seattle(locale);
        return [
            'no samples. A few real files of the kind this dictionary is for show that it works on real text. Add them to samples/.' +
                (article
                    ? ` For a natural language, save the text of the Wikipedia article on Seattle, ${article}, as samples/seattle.md.`
                    : ''),
        ];
    }
    return samples
        .filter((sample) => !sample.origin)
        .map((sample) => `the sample ${basename(sample.path)} has no origin. Give it with --add-sample-origin.`);
}

/** The Wikipedia article on Seattle in the dictionary's language, or undefined for any language. */
export function seattle(locale: string): string | undefined {
    const language = locale.split(',')[0]?.trim().split(/[-_]/)[0]?.toLowerCase();
    return language && language !== '*' ? `https://${language}.wikipedia.org/wiki/Seattle` : undefined;
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
        lines.push(`- \`${basename(sample.path)}\`: ${sample.origin || 'no known origin'}.`);
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
