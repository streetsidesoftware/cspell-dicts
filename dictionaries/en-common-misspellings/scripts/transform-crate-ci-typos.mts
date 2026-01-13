#!/usr/bin/env node

import fs from 'node:fs/promises';

import { readFileText } from 'cspell-io';
import { decodeTrie, parseDictionary, type ITrie } from 'cspell-trie-lib';

const root = new URL('../', import.meta.url);

const typesDirURL = new URL('src/crate-ci/typos/', root);
const outdirURL = new URL('src/fromCrateTypos/', root);

const dictionaryUrls = {
    'en-US': new URL('../en_US/en_US.trie', root),
    'en-GB': new URL('../en_GB/en_GB.trie', root),
    softwareTerms: new URL('../software-terms/dict/softwareTerms.txt', root),
    exclude: new URL('src/excludeWords.txt', root),
} as const;

interface SyncInfo {
    'https://github.com/crate-ci/typos'?: string;
}

interface TyposEntry {
    word: string;
    suggestions: string[];
}

interface Dictionaries {
    'en-US': ITrie;
    'en-GB': ITrie;
    softwareTerms: ITrie;
    exclude: ITrie;
}

function getHeader(locale: string, syncTag: string): string {
    return `\
# This file is generated from:
#   https://github.com/crate-ci/typos/blob/${syncTag}/crates/typos-dict/assets/words.csv
# The form is:
# misspelling->suggestion
#
# cspell\x3Alocale ${locale}
#
# Tell cspell to not spell check the misspelled words:
# cspell\x3AignoreRegExp /\\b[\\p{L}'-]+->/gmu
#
`;
}

async function loadDictionaryFromFile(fileName: URL): Promise<ITrie> {
    const file = await readFileText(fileName);
    const trie = /\.trie\b/.test(fileName.pathname) ? decodeTrie(file) : parseDictionary(file);
    return trie;
}

async function loadDictionaries(): Promise<Dictionaries> {
    return {
        'en-US': await loadDictionaryFromFile(dictionaryUrls['en-US']),
        'en-GB': await loadDictionaryFromFile(dictionaryUrls['en-GB']),
        softwareTerms: await loadDictionaryFromFile(dictionaryUrls.softwareTerms),
        exclude: await loadDictionaryFromFile(dictionaryUrls.exclude),
    };
}

async function readTyposEntries(): Promise<TyposEntry[]> {
    const file = await readFileText(new URL('words.csv', typesDirURL));
    return file
        .split(/\r?\n/g)
        .map((line) => line.trim())
        .map((line) => line.split(',').map((word) => word.trim()))
        .map((words) => ({ word: words[0], suggestions: words.slice(1) }));
}

function processEntry(entry: TyposEntry, dict: ITrie, excludeDict: ITrie): string | undefined {
    // if (dict.has(entry.word)) {
    //     return undefined; // Skip if the word is already in the dictionary
    // }
    const suggestions = entry.suggestions.filter((sug) => !excludeDict.hasWord(sug, false) && dict.hasWord(sug, false));
    if (!suggestions.length) {
        return undefined; // Skip if no valid suggestions
    }
    return `${entry.word}->${suggestions.join(',')}`;
}

async function writeEntriesToFile(url: URL, entries: Set<string>, locale: string, syncTag: string): Promise<void> {
    const content = getHeader(locale, syncTag) + [...entries].sort().join('\n') + '\n';
    await fs.writeFile(url, content, 'utf8');
}

async function main(): Promise<void> {
    const syncInfo = JSON.parse(await fs.readFile(new URL('.sync-github-files.json', typesDirURL), 'utf8')) as SyncInfo;
    const syncTag = syncInfo['https://github.com/crate-ci/typos'] || 'v1.33.1';
    const dictionaries = await loadDictionaries();
    const typosEntries = await readTyposEntries();
    const entriesEnAll = new Set<string>();
    const entriesEnUS = new Set<string>();
    const entriesEnGB = new Set<string>();
    const entriesSoftwareTerms = new Set<string>();

    for (const entry of typosEntries) {
        const enUS = processEntry(entry, dictionaries['en-US'], dictionaries.exclude);
        const enGB = processEntry(entry, dictionaries['en-GB'], dictionaries.exclude);
        if (enUS === enGB) {
            if (enUS) {
                entriesEnAll.add(enUS);
            }
        } else {
            if (enUS) {
                entriesEnUS.add(enUS);
            }
            if (enGB) {
                entriesEnGB.add(enGB);
            }
        }
        const softwareTerms = processEntry(entry, dictionaries.softwareTerms, dictionaries.exclude);
        if (softwareTerms && softwareTerms !== enUS) {
            entriesSoftwareTerms.add(softwareTerms);
        }
    }

    await writeEntriesToFile(new URL('dict-en-us.txt', outdirURL), entriesEnUS, 'en-US', syncTag);
    await writeEntriesToFile(new URL('dict-en-gb.txt', outdirURL), entriesEnGB, 'en-GB', syncTag);
    await writeEntriesToFile(new URL('dict-en.txt', outdirURL), entriesEnAll, 'en', syncTag);
    await writeEntriesToFile(new URL('softwareTerms.txt', outdirURL), entriesSoftwareTerms, 'en', syncTag);
}

main();
