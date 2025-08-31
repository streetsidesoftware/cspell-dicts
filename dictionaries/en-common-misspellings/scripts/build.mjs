#!/usr/bin/env node

// ts-check
import { promises as fs } from 'node:fs';

import { parseDocument } from 'yaml';

const root = new URL('../', import.meta.url);

const srcFiles = ['dict-en.txt', 'dict-en-gb.txt', 'dict-en-us.txt'];
const srcDirs = ['src/', 'src/wikipedia/', 'src/fromCrateTypos/'];
const targetDir = new URL('dict/', root);
const srcDir = new URL('src/', root);

const descriptions = {
    'dict-en.txt': 'Common English misspellings',
    'dict-en-gb.txt': 'Common British English misspellings',
    'dict-en-us.txt': 'Common American English misspellings',
};

/**
 * @import { Document, Scalar, YAMLSeq } from 'yaml';
 */

/**
 *
 * @param {string | URL} file
 * @returns Promise<string[]>
 */
async function readSrcFileLines(file) {
    const content = await fs.readFile(file, 'utf8');
    return content
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith('#'));
}

/**
 * @typedef { {word: string; suggestions: string[]; comment: string} } Entry
 */

/**
 *
 * @param {string} line
 * @returns {Entry}
 */
function lineToEntry(line) {
    const [word, rest] = line.split('->', 2);
    const [sug, comment = ''] = rest.split('#', 2);
    const suggestions = sug.split(',').map((s) => s.trim());
    return {
        word: word.trim(),
        suggestions,
        comment,
    };
}

/**
 *
 * @param {Entry | undefined} a
 * @param {Entry} b
 * @returns {Entry}
 */
function mergeEntries(a, b) {
    if (!a) {
        return b;
    }
    const merged = {
        word: a.word,
        suggestions: [...new Set([...a.suggestions, ...b.suggestions])].sort((a, b) => a.localeCompare(b)),
        comment: a.comment || b.comment,
    };
    return merged;
}

/**
 *
 * @param {Document} doc
 * @param {Entry} entry
 * @returns {Scalar<string>}
 */
function yamlEntry(doc, entry) {
    const { word, suggestions, comment } = entry;
    const value = `${word}->${suggestions.join(', ')}`.trim();
    const yamlEntry = doc.createNode(value);
    if (comment) {
        yamlEntry.comment = comment;
    }
    return yamlEntry;
}

/**
 *
 * @param {Entry} a
 * @param {Entry} b
 * @returns
 */
function compareEntries(a, b) {
    return a.word.localeCompare(b.word);
}

/**
 *
 * @param {string} srcBaseName
 */
async function processSrc(srcBaseName) {
    const yamlFileName = srcBaseName.replace('.txt', '.yaml');
    const jsonFileName = srcBaseName.replace('.txt', '.json');
    const dstJsonFile = new URL(jsonFileName, targetDir);
    const srcYamlFile = new URL(yamlFileName, srcDir);
    const description = descriptions[srcBaseName] || '';

    /** @type {Map<string, Entry>} */
    const entriesSug = new Map();
    /** @type {Map<string, Entry>} */
    const entriesFlag = new Map();

    for (const srcDir of srcDirs) {
        const srcFile = new URL(srcBaseName, new URL(srcDir, root));
        const lines = await readSrcFileLines(srcFile);
        for (const line of lines) {
            if (!line) continue;
            const entry = lineToEntry(line);
            const isFlagged = entry.word.startsWith('!');
            if (isFlagged) {
                entry.word = entry.word.slice(1); // remove leading '!'
            }
            const entriesMap = isFlagged ? entriesFlag : entriesSug;
            entriesMap.set(entry.word, mergeEntries(entriesMap.get(entry.word), entry));
        }
    }

    const strYaml = await fs.readFile(srcYamlFile, 'utf8');
    const doc = parseDocument(strYaml);
    const dict = doc.getIn(['dictionaryDefinitions', 0]);
    dict.set('description', description);
    const toProcess = [
        ['flagWords', entriesFlag],
        ['suggestWords', entriesSug],
    ];

    for (const [key, entriesMap] of toProcess) {
        if (entriesMap.size > 0) {
            dict.set(key, doc.createNode([...entriesMap.values()].sort(compareEntries).map((e) => yamlEntry(doc, e))));
        } else {
            dict.delete(key);
        }
    }

    await fs.writeFile(dstJsonFile, JSON.stringify(doc.toJS(), null, 1), 'utf8');
}

async function run() {
    for (const srcFile of srcFiles) {
        await processSrc(srcFile);
    }
}

run();
