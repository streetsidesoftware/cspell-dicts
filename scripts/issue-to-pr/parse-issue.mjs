#!/usr/bin/env node

// Phase 4: parse and validate the structured body of an "Add Dictionary Words"
// issue form submission. Reads the raw issue body from $ISSUE_BODY (never
// interpolated into a shell command - see issue-to-pr.yml) and the
// dictionaries root from $DICTIONARIES_ROOT.
//
// The issue creator names the exact source file to edit (e.g.
// "git/src/terms.txt") rather than just a dictionary name, so there's no
// need to guess which file to use when a dictionary has more than one -
// see "Letting the issue creator pick the exact file" in docs/issue-to-pr-poc.md.
//
// Outputs (via $GITHUB_OUTPUT): file, dictionary, words (JSON array)

import { existsSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { fail, writeOutput } from './lib.mjs';

const DICTIONARIES_ROOT = process.env.DICTIONARIES_ROOT || 'dictionaries';
const FILE_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9_-]*\/src\/[a-zA-Z0-9][a-zA-Z0-9_.-]*\.txt$/;
const WORD_PATTERN = /^[^\s`<>|]{1,64}$/u;
const MAX_WORDS = 200;
const NO_RESPONSE = '_No response_';

/**
 * Issue forms render each field as "### {label}\n\n{value}\n\n...".
 * @param {string} body
 * @returns {Record<string, string>}
 */
export function parseIssueForm(body) {
    const sections = {};
    let key = null;
    let buffer = [];

    const flush = () => {
        if (key) sections[key] = buffer.join('\n').trim();
        buffer = [];
    };

    for (const line of body.split(/\r?\n/)) {
        const heading = /^###\s+(.+?)\s*$/.exec(line);
        if (heading) {
            flush();
            key = heading[1].trim().toLowerCase();
            continue;
        }
        if (key) buffer.push(line);
    }
    flush();

    return sections;
}

/**
 * Validate the issue creator's chosen target file (e.g. "git/src/terms.txt")
 * and resolve it to a path relative to the repo root.
 * @param {string} file
 * @param {string} dictionariesRoot
 * @returns {string}
 */
export function validateFile(file, dictionariesRoot) {
    if (!file || file === NO_RESPONSE) {
        fail('The "File" field is empty.');
    }
    if (!FILE_PATTERN.test(file)) {
        fail(
            `"${file}" is not a valid path. It must look like "<dictionary>/src/<file>.txt" (e.g. "docker/src/docker.txt") - browse dictionaries/ on GitHub to find it.`,
        );
    }

    const fullPath = path.join(dictionariesRoot, file);
    const resolvedRoot = path.resolve(dictionariesRoot) + path.sep;
    const resolvedPath = path.resolve(fullPath);
    if (!resolvedPath.startsWith(resolvedRoot)) {
        fail('Invalid file path.');
    }
    if (!existsSync(fullPath)) {
        fail(
            `No file found at "${dictionariesRoot}/${file}". File paths are case-sensitive and must match an existing file.`,
        );
    }

    return fullPath;
}

/**
 * @param {string} wordsRaw
 * @returns {string[]}
 */
export function parseWords(wordsRaw) {
    if (!wordsRaw || wordsRaw === NO_RESPONSE) {
        fail('The "Words" field is empty.');
    }

    const seen = new Set();
    const words = [];
    for (const rawLine of wordsRaw.split(/\r?\n/)) {
        const word = rawLine.trim();
        if (!word || word === NO_RESPONSE || seen.has(word)) continue;
        seen.add(word);
        if (!WORD_PATTERN.test(word)) {
            fail(`"${word}" contains characters that are not allowed in a submitted word.`);
        }
        words.push(word);
    }

    if (words.length === 0) {
        fail('No valid words were found in the "Words" field.');
    }
    if (words.length > MAX_WORDS) {
        fail(
            `Too many words submitted (${words.length}). This proof-of-concept allows a maximum of ${MAX_WORDS} per issue.`,
        );
    }

    return words;
}

function main() {
    const body = process.env.ISSUE_BODY || '';
    const sections = parseIssueForm(body);

    const file = (sections['file'] || '').trim();
    const fullPath = validateFile(file, DICTIONARIES_ROOT);
    const dictionary = file.split('/')[0];

    const words = parseWords((sections['words'] || '').trim());

    writeOutput('file', fullPath);
    writeOutput('dictionary', dictionary);
    writeOutput('words', JSON.stringify(words));
    console.log(`Parsed ${words.length} word(s) for "${fullPath}": ${words.join(', ')}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    main();
}
