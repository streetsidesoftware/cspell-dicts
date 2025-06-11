#!/usr/bin/env node

// ts-check
import fs from 'node:fs/promises';

import { readFileText } from 'cspell-io';
import { decodeTrie, parseDictionary } from 'cspell-trie-lib';

const typesDirURL = new URL('../src/crate-ci/typos/', import.meta.url);

const dictionaryUrls = {
    'en-US': new URL('../../en_US/en_US.trie', import.meta.url),
    'en-GB': new URL('../../en_GB/en_GB.trie', import.meta.url),
};

function getHeader(locale) {
    return `\
# This file is generated from the words.csv
# Add additional suggestions here.
# the form is:
# misspelling->suggestion
#
# cspell\x3Alocale ${locale}
#
# Tell cspell to not spell check the misspelled words:
# cspell\x3AignoreRegExp /\\b[\\p{L}'-]+->/gmu
#
`;
}

async function loadDictionaryFromFile(fileName) {
    const file = await readFileText(fileName);
    const trie = /\.trie\b/.test(fileName) ? decodeTrie(file) : parseDictionary(file);
    return trie;
}

async function loadDictionaries() {
    return {
        'en-US': await loadDictionaryFromFile(dictionaryUrls['en-US']),
        'en-GB': await loadDictionaryFromFile(dictionaryUrls['en-GB']),
    };
}

async function readTyposEntries() {
    const file = await readFileText(new URL('words.csv', typesDirURL));
    return file
        .split(/\r?\n/g)
        .map((line) => line.trim())
        .map((line) => line.split(',').map((word) => word.trim()))
        .map((words) => ({ word: words[0], suggestions: words.slice(1) }));
}

function processEntry(entry, dict) {
    if (dict.has(entry.word)) {
        return undefined; // Skip if the word is already in the dictionary
    }
    const suggestions = entry.suggestions.filter((sug) => dict.has(sug));
    if (!suggestions.length) {
        return undefined; // Skip if no valid suggestions
    }
    return `${entry.word}->${suggestions.join(',')}`;
}

async function writeEntriesToFile(url, entries, locale) {
    const content = getHeader(locale) + [...entries].sort().join('\n') + '\n';
    await fs.writeFile(url, content, 'utf8');
}

async function main() {
    const dictionaries = await loadDictionaries();
    const typosEntries = await readTyposEntries();
    const entriesEnAll = new Set();
    const entriesEnUS = new Set();
    const entriesEnGB = new Set();

    for (const entry of typosEntries) {
        const enUS = processEntry(entry, dictionaries['en-US']);
        const enGB = processEntry(entry, dictionaries['en-GB']);
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
    }

    await writeEntriesToFile(new URL('dict-en-us.txt', typesDirURL), entriesEnUS, 'en-US');
    await writeEntriesToFile(new URL('dict-en-gb.txt', typesDirURL), entriesEnGB, 'en-GB');
    await writeEntriesToFile(new URL('dict-en.txt', typesDirURL), entriesEnAll, 'en');
}

main();
