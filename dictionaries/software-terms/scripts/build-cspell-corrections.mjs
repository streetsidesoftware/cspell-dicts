#!/usr/bin/env node

// ts-check
import { promises as fs } from 'node:fs';

import { parseDocument } from 'yaml';

const root = new URL('../', import.meta.url);

const srcDir = new URL('src/', root);
const targetDir = new URL('dict/', root);

const srcYamlFileName = 'cspell-corrections.yaml';
const srcYamlFileURL = new URL(srcYamlFileName, srcDir);
const srcFileURLs = ['../en-common-misspellings/src/fromCrateTypos/softwareTerms.txt'].map((p) => new URL(p, root));
const targetYamlFileURL = new URL(srcYamlFileName, targetDir);

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
 * @typedef { word: string; suggestions: string[]; comment: string } Entry
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
 * @param {string[]} lines
 * @param {Map<string, Entry>} entriesSug
 * @param {Map<string, Entry>} entriesFlag
 */
function processLines(lines, entriesSug, entriesFlag) {
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

/**
 *
 * @param {URL} srcFileURL
 * @param {Map<string, Entry>} entriesSug
 * @param {Map<string, Entry>} entriesFlag
 */
async function processFile(srcFileURL, entriesSug, entriesFlag) {
    const lines = await readSrcFileLines(srcFileURL);
    processLines(lines, entriesSug, entriesFlag);
}

async function processSrc() {
    const srcYamlContent = await fs.readFile(srcYamlFileURL, 'utf8');
    const doc = parseDocument(srcYamlContent);
    const dict = doc.getIn(['dictionaryDefinitions', 0]);

    /** @type {Map<string, Entry>} */
    const entriesSug = new Map();
    /** @type {Map<string, Entry>} */
    const entriesFlag = new Map();

    const currentSuggestWords = dict.get('suggestWords')?.toJS(doc) || [];
    const currentFlagWords = dict.get('flagWords')?.toJS(doc) || [];

    processLines(currentSuggestWords, entriesSug, entriesFlag);
    processLines(
        currentFlagWords.map((line) => '!' + line),
        entriesSug,
        entriesFlag,
    );

    for (const srcFileURL of srcFileURLs) {
        await processFile(srcFileURL, entriesSug, entriesFlag);
    }

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

    await fs.writeFile(targetYamlFileURL, doc.toString(), 'utf8');
}

async function run() {
    await processSrc();
}

run();
