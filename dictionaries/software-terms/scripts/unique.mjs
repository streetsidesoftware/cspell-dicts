#!/usr/bin/env node

// ts-check
import { promises as fs } from 'node:fs';

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
 * @typedef { word: string; suggestions: string[]; comment: string, line: string } Entry
 */

/**
 *
 * @param {string} line
 * @returns {Entry}
 */
function lineToEntry(line) {
    const [word, rest = ''] = line.split('->', 2);
    const [sug, comment = ''] = rest.split('#', 2);
    const suggestions = sug.split(',').map((s) => s.trim());
    return {
        word: word.trim(),
        suggestions,
        comment,
        line,
    };
}

async function readFileEntries(file) {
    const lines = await readSrcFileLines(file);
    return lines.map(lineToEntry);
}

const usage = `\
Usage:
  unique <wordsFile> <...searchInFiles>
Returns unique entries from the words file file that are not present in the search files.
`;

async function run() {
    if (process.argv.length <= 4) {
        console.error(usage);
        process.exitCode = 1;
        return;
    }

    const [srcFile1] = process.argv.slice(2);
    const searchFiles = process.argv.slice(3);

    const words = await readFileEntries(srcFile1);
    const searchIn = (await Promise.all(searchFiles.map((file) => readFileEntries(file)))).flatMap(
        (entries) => entries,
    );

    const known = new Set(searchIn.map((e) => e.word));
    const uniqueEntries = words.filter((e) => !known.has(e.word));

    if (uniqueEntries.length === 0) {
        console.log('No unique entries found.');
        return;
    }
    for (const entry of uniqueEntries) {
        console.log(entry.line);
    }
}

run();
