import { promises as fs } from 'fs';

export type WordFreqMap = Map<string, number>;

export const wordFreqUrl = new URL('../dict/en-freq.tsv', import.meta.url);

export async function loadWordFreqMap(): Promise<WordFreqMap> {
    const data = await fs.readFile(wordFreqUrl, 'utf-8');
    const freq = data
        .split('\n')
        .filter((line) => line.trim())
        .map((line) => {
            const [word, freq] = line.split('\t');
            return [word.trim(), Number.parseFloat(freq || '0')] as [string, number];
        });
    return new Map<string, number>(freq);
}

export async function loadWordFreqCollection(): Promise<WordFreqCollection> {
    return new WordFreqCollection(await loadWordFreqMap());
}

export class WordFreqCollection {
    private wordForms: Map<string, Set<string>>;

    constructor(readonly map: WordFreqMap) {
        this.wordForms = calcWordForms(map.keys());
    }

    get(word: string): number | undefined {
        return this.map.get(word);
    }

    has(word: string): boolean {
        return this.map.has(word);
    }

    keys(): Iterable<string> {
        return this.map.keys();
    }

    /**
     * Search for matching words.
     * The search is case-insensitive.
     * @param word - the words to search for.
     * @returns Array of words found or undefined if not found.
     */
    searchForms(word: string): string[] | undefined {
        const key = word.normalize().toLowerCase();
        const found = this.wordForms.get(key);
        return found && [...found];
    }

    search(word: string): [string, number][] | undefined {
        const forms = this.searchForms(word);
        if (!forms) return undefined;
        return forms
            .map((word) => [word, this.map.get(word)] as [string, number | undefined])
            .filter((a): a is [string, number] => a[1] !== undefined);
    }
}

function calcWordForms(words: string[] | Iterable<string>): Map<string, Set<string>> {
    const map = new Map<string, Set<string>>();

    function addWord(key: string, word: string) {
        const list = map.get(key) ?? new Set();
        list.add(word);
        map.set(key, list);
    }

    for (const word of words) {
        const key = word.normalize().toLowerCase();
        addWord(key, word);
        addWord(key.replace(/[^\p{L}\d]/gu, ''), word);
        addWord(key.normalize('NFD').replace(/[^\p{L}\d]/gu, ''), word);
    }

    return map;
}
