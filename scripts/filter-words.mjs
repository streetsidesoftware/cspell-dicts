#!/usr/bin/env node

// ts-check

import { parseArgs } from 'node:util';

import { readFileText } from 'cspell-io';
import {} from 'cspell-dictionary';
import { decodeTrie, parseDictionary } from 'cspell-trie-lib';

async function readWordList(fileName) {
    const file = await readFileText(fileName);
    const trie = /\.trie\b/.test(fileName) ? decodeTrie(file) : parseDictionary(file);
    return trie;
}

function lowerCaseMap(trie) {
    const knownWords = new Map();
    for (const word of trie.words()) {
        knownWords.set(word, [word]);
        const w2 = word.toLowerCase();
        if (w2 === word) continue;
        const found = knownWords.get(w2);
        if (found) {
            found.push(word);
        } else {
            knownWords.set(w2, [word]);
        }
    }

    return knownWords;
}

async function fixCase(inputFile, sourceFile) {
    const inputTrie = await readWordList(inputFile);
    const sourceTrie = await readWordList(sourceFile);

    const knownWords = lowerCaseMap(sourceTrie);

    const missingWords = new Set();

    for (const word of inputTrie.words()) {
        if (word.startsWith('~')) continue;
        let found = knownWords.get(word);
        let suffix = '';
        if (!found && word.endsWith("'s")) {
            suffix = "'s";
            found = knownWords.get(word.slice(0, -2));
        }

        for (const w of found || []) {
            missingWords.add(w + suffix);
        }
    }

    for (const word of missingWords) {
        console.log(word);
    }
}

/**
 *
 * @param {string} inputFile
 * @param {string} filterFile
 */
async function filterWordFiles(inputFile, filterFile) {
    const inputTrie = await readWordList(inputFile);
    const filterTrie = await readWordList(filterFile);

    const knownWords = lowerCaseMap(filterTrie);

    const missingWords = new Set();

    for (const word of inputTrie.words()) {
        if (word.startsWith('~')) continue;
        if (!knownWords.has(word)) {
            missingWords.add(word);
        }
    }

    for (const word of missingWords) {
        console.log(word);
    }
}

const usage = `
Usage:
  filter-words filter <input> <filter>      Filter out words from <input> found in <filter>
  filter-words fix-case <input> <filter>    Fix the case of words in <input> using <filter>
`;

function main() {
    const parsOptions = {
        allowPositionals: true,
        options: {},
        allowNegative: true,
    };

    const args = parseArgs({ args: process.argv.slice(2), ...parsOptions });

    console.error('Filter Words');

    if (args.positionals.length < 2) {
        console.error('%s', usage);
        process.exitCode = 1;
        return;
    }

    switch (args.positionals[0]) {
        case 'fix-case':
            return fixCase(args.positionals[1], args.positionals[2]);
        case 'filter':
            break;
        default:
            console.error(`Unknown command: ${args.positionals[0]}`);
            process.exitCode = 1;
            return;
    }

    return filterWordFiles(args.positionals[1], args.positionals[2]);
}

main();
