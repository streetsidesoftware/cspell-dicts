import { opMap, pipeAsync, pipeSync } from '@cspell/cspell-pipe';

import { autoDecompress, decodeUtf8AsyncIterable, toLinesAsync } from './stream.mjs';

export function getURLForNGram(prefix: string, n = 1): string {
    // Example: http://storage.googleapis.com/books/ngrams/books/googlebooks-eng-all-1gram-20120701-h.gz
    return `http://storage.googleapis.com/books/ngrams/books/googlebooks-eng-all-${n}gram-20120701-${prefix}.gz`;
}

export function getURLForNGramTotals(n = 1) {
    return `http://storage.googleapis.com/books/ngrams/books/20200217/eng/totalcounts-${n}`;
}

const regExIsLetter = /^[a-zA-Z]$/;

const gramPrefixes = [
    [],
    '0 1 2 3 4 5 6 7 8 9 a b c d e f g h i j k l m n o other p pos punctuation q r s t u v w x y z'
        .split(' ')
        .filter((v) => regExIsLetter.test(v)),
];

interface CountEntry {
    /**
     * Year of the count
     */
    year: number;
    /**
     * Number of times the n-gram appears in the corpus for the given year
     */
    count: number;
    /**
     * Number of "books" that contain the n-gram
     */
    volumes: number;
}

interface WordFreq {
    /**
     * The word
     */
    word: string;
    /**
     * Occurrences per million words.
     */
    freq: number;

    /**
     * Total number of occurrences in the corpus.
     */
    count?: number;

    /**
     * The count by POS of the word in the corpus.
     */
    posCounts?: Record<string, number>;

    /**
     * The frequency by POS of the word in the corpus.
     */
    posFreq?: Record<string, number>;
}

function parseTotalsData(rawData: string): CountEntry[] {
    const lines = rawData.split(/\s+/g).filter((a) => a);
    const values = lines.map((line) => {
        return line.split(',').map((value) => Number(value));
    });
    return values.map(([year, count, volumes]) => ({ year, count, volumes }));
}

export async function fetchTotals(n?: number) {
    const url = getURLForNGramTotals(n);
    const response = await fetch(url);
    const data = await response.text();
    return parseTotalsData(data);
}

export function nGramAccumulator(
    totals: CountEntry[],
    options: AccumulationOptions,
): (lines: AsyncIterable<string>) => AsyncIterable<WordFreq> {
    const opts = accOptionsDefaults(options);

    const totalWordCount = totals.filter((a) => a.year >= opts.minYear).reduce((a, b) => a + b.count, 0);

    async function* accumulator(lines: AsyncIterable<string>): AsyncIterable<WordFreq> {
        const { minYear, minVolumes, sep } = opts;

        const sMinYear = minYear.toString();

        let curr: Required<WordFreq> | undefined;

        function patchCurr(curr: Required<WordFreq>): Required<WordFreq> {
            curr.freq = (1e6 * curr.count) / totalWordCount;
            curr.posFreq = Object.fromEntries(
                Object.entries(curr.posCounts).map(([k, v]) => [k, (1e6 * v) / totalWordCount]),
            );
            return curr;
        }

        for await (const line of lines) {
            const [wordEx, year, count, volumes] = line.split(sep);
            if (year < sMinYear || minVolumes > Number(volumes)) {
                continue;
            }

            const [word, pos = ''] = wordEx.split('_');

            if (curr?.word !== word) {
                if (curr) {
                    yield patchCurr(curr);
                }
                // console.log('Next word: %s -> %s:%s', curr?.word || '*', word, pos);
                curr = { word, freq: 0, count: 0, posCounts: {}, posFreq: {} };
            }

            const cnt = Number(count);
            curr.posCounts[pos] = (curr.posCounts[pos] || 0) + cnt;
            curr.count += cnt;
        }

        if (curr) {
            yield patchCurr(curr);
        }
    }

    return accumulator;
}

interface AccumulationOptions {
    /**
     * The n-Gram level 1 = single word, 2 = two words, etc.
     */
    n?: 1 | undefined;
    /**
     * The minimum year to consider
     * @default 2000
     */
    minYear?: number | undefined;
    /**
     * The minimum number of volumes the n-gram appears in
     * @default 1000
     */
    minVolumes?: number | undefined;
    /**
     * The separator used in the download
     * @default '\t'
     */
    sep?: string | undefined;
}

export function createMapWordFreqToCsvLines(sep = '\t'): (f: WordFreq) => string {
    return ({ word, freq }) => `${word}${sep}${freq}\n`;
}

function mapWordFreqToCsvLines(sep = '\t'): (i: Iterable<[word: string, freq: number]>) => Iterable<string> {
    function* map(i: Iterable<[word: string, freq: number]>) {
        for (const [word, freq] of i) {
            yield `${word}${sep}${freq.toPrecision(4)}\n`;
        }
    }

    return map;
}

export interface DownLoadNGramsOptions extends AccumulationOptions {
    prefixes?: string[];
    totals?: CountEntry[];
}

interface FileNGram {
    prefix: string;
    lines: Iterable<string>;
}

export async function* downloadNGrams(options: DownLoadNGramsOptions): AsyncIterable<FileNGram> {
    const opts = accOptionsDefaults(options);

    const nPrefixes = gramPrefixes[opts.n];
    const initialPrefixes = opts.prefixes ?? nPrefixes;
    const prefixes = initialPrefixes.filter((a) => nPrefixes.includes(a));

    const totals = opts.totals || (await fetchTotals(opts.n));

    const acc = nGramAccumulator(totals, opts);

    const mapToLines = mapWordFreqToCsvLines(opts.sep);

    for (const prefix of prefixes) {
        console.log('Downloading %s...', prefix);
        const wordFreq = new Map<string, number>();
        for await (const entry of pipeAsync(fetchNGramLines(prefix, opts), acc)) {
            const existing = wordFreq.get(entry.word);
            if (existing) {
                entry.freq += existing;
            }
            wordFreq.set(entry.word, entry.freq);
        }

        const normalized = cleanupWordFreq(wordFreq);

        console.log({ found: wordFreq.size, normalized: normalized.size });

        yield { prefix, lines: mapToLines(normalized) };
    }
}

type RequiredNoUndefined<T> = {
    [P in keyof T]-?: Exclude<T[P], undefined>;
};

// type MakeKeysRequired<T, K extends keyof T> = Omit<T, keyof AccumulationOptions> & RequiredNoUndefined<AccumulationOptions>;

function accOptionsDefaults<T extends AccumulationOptions>(
    options: T,
): Omit<T, keyof AccumulationOptions> & RequiredNoUndefined<AccumulationOptions> {
    const { n = 1, minYear = 2000, minVolumes = 1000, sep = '\t' } = options;
    return { ...options, n, minYear, minVolumes, sep };
}

async function* fetchNGramLines(prefix: string, options: AccumulationOptions): AsyncGenerator<string> {
    const url = getURLForNGram(prefix, options.n);
    const response = await fetch(url);

    const body = response.body;
    if (!body) {
        return;
    }

    for await (const part of pipeAsync(body, autoDecompress, decodeUtf8AsyncIterable, toLinesAsync)) {
        yield part;
    }
}

function compareWordsAdj([aw, an]: [string, number], [bw, bn]: [string, number]): number {
    const alc = aw.toLowerCase();
    const blc = bw.toLowerCase();

    const sa = alc === aw ? 3 : 1;
    const sb = blc === bw ? 3 : 1;

    const ca = an * sa;
    const cb = bn * sb;
    return cb - ca;
}

function cleanupWordFreq(map: Map<string, number>): Map<string, number> {
    const normalized = new Map<string, Map<string, number>>();

    for (const [w, f] of map.entries()) {
        const nw = w.normalize('NFC');
        const lc = nw.toLowerCase();
        const existing = normalized.get(lc) || new Map<string, number>();
        normalized.set(lc, existing.set(nw, f));
    }

    const entries = pipeSync(
        normalized.values(),
        opMap((m) => {
            const entries = [...m.entries()].sort(compareWordsAdj);
            return entries.reduce((acc, [_, v]) => ((acc[1] += v), acc));
        }),
    );
    const r = new Map([...entries].sort((a, b) => b[1] - a[1]));

    return r;
}
