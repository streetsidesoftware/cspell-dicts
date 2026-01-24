#!/usr/bin/env node

import { promises as fs } from 'node:fs';

import { parseDocument, type Document, type Scalar, type YAMLSeq } from 'yaml';

const root = new URL('../', import.meta.url);

const srcFiles = ['dict-en.txt', 'dict-en-gb.txt', 'dict-en-us.txt'] as const;
const srcDirs = ['src/', 'src/wikipedia/', 'src/fromCrateTypos/'] as const;
const targetDir = new URL('dict/', root);
const srcDir = new URL('src/', root);

const descriptions: Record<string, string> = {
    'dict-en.txt': 'Common English misspellings',
    'dict-en-gb.txt': 'Common British English misspellings',
    'dict-en-us.txt': 'Common American English misspellings',
};

async function readSrcFileLines(file: string | URL): Promise<string[]> {
    const content = await fs.readFile(file, 'utf8');
    return content
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith('#'));
}

interface Entry {
    word: string;
    suggestions: string[];
    comment: string;
}

function lineToEntry(line: string): Entry {
    const [word, rest] = line.split('->', 2);
    const [sug, comment = ''] = rest.split('#', 2);
    const suggestions = sug.split(',').map((s) => s.trim());
    return {
        word: word.trim(),
        suggestions,
        comment,
    };
}

function mergeEntries(a: Entry | undefined, b: Entry): Entry {
    if (!a) {
        return b;
    }
    const merged: Entry = {
        word: a.word,
        suggestions: [...new Set([...a.suggestions, ...b.suggestions])].sort((a, b) => a.localeCompare(b)),
        comment: a.comment || b.comment,
    };
    return merged;
}

function yamlEntry(doc: Document, entry: Entry): Scalar<string> {
    const { word, suggestions, comment } = entry;
    const value = `${word}->${suggestions.join(', ')}`.trim();
    const yamlEntry = doc.createNode(value) as Scalar<string>;
    if (comment) {
        yamlEntry.comment = comment;
    }
    return yamlEntry;
}

function compareEntries(a: Entry, b: Entry): number {
    return a.word.localeCompare(b.word);
}

async function processSrc(srcBaseName: string): Promise<void> {
    const yamlFileName = srcBaseName.replace('.txt', '.yaml');
    const jsonFileName = srcBaseName.replace('.txt', '.json');
    const dstJsonFile = new URL(jsonFileName, targetDir);
    const srcYamlFile = new URL(yamlFileName, srcDir);
    const description = descriptions[srcBaseName] || '';

    const entriesSug = new Map<string, Entry>();
    const entriesFlag = new Map<string, Entry>();

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
    const dict = doc.getIn(['dictionaryDefinitions', 0]) as YAMLSeq;
    dict.set('description', description);
    const toProcess: [string, Map<string, Entry>][] = [
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

async function run(): Promise<void> {
    for (const srcFile of srcFiles) {
        await processSrc(srcFile);
    }
}

run();
