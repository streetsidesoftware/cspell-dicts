#!/usr/bin/env node

// Phase 4: parse and validate the structured body of an "Add Dictionary Words"
// issue form submission. Reads the raw issue body from $ISSUE_BODY (never
// interpolated into a shell command - see issue-to-pr.yml) and the
// dictionaries root from $DICTIONARIES_ROOT.
//
// Outputs (via $GITHUB_OUTPUT): dictionary, words (JSON array)

import { existsSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { fail, writeOutput } from './lib.mjs';

const DICTIONARIES_ROOT = process.env.DICTIONARIES_ROOT || 'dictionaries';
const SLUG_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9_-]*$/;
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
 * @param {string} dictionary
 * @param {string} dictionariesRoot
 */
export function validateDictionary(dictionary, dictionariesRoot) {
    if (!dictionary || dictionary === NO_RESPONSE) {
        fail('The "Dictionary" field is empty.');
    }
    if (!SLUG_PATTERN.test(dictionary)) {
        fail(`"${dictionary}" is not a valid dictionary name (only letters, numbers, "-" and "_" are allowed).`);
    }

    const dictDir = path.join(dictionariesRoot, dictionary);
    const resolvedRoot = path.resolve(dictionariesRoot) + path.sep;
    const resolvedDir = path.resolve(dictDir);
    if (!resolvedDir.startsWith(resolvedRoot)) {
        fail('Invalid dictionary path.');
    }
    if (!existsSync(dictDir)) {
        fail(
            `No dictionary named "${dictionary}" exists under "${dictionariesRoot}/". Dictionary names are case-sensitive and must match an existing folder.`,
        );
    }
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

    const dictionary = (sections['dictionary'] || '').trim();
    validateDictionary(dictionary, DICTIONARIES_ROOT);

    const words = parseWords((sections['words'] || '').trim());

    writeOutput('dictionary', dictionary);
    writeOutput('words', JSON.stringify(words));
    console.log(`Parsed ${words.length} word(s) for dictionary "${dictionary}": ${words.join(', ')}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    main();
}
