#!/usr/bin/env node

// Phase 5: locate the single source .txt file that new words should be
// appended to for a given (already-validated) dictionary name.
//
// Most dictionaries in this repo have exactly one `src/*.txt` file, so that
// is the happy path. A handful (git, python, typescript, node, ...) have
// several. For those, we only proceed if exactly one of the candidate files
// contains the trailing "Please add new terms above this line" marker -
// otherwise we refuse to guess and fail with a clear explanation.
//
// Input: $DICTIONARY (validated slug from parse-issue.mjs)
// Output (via $GITHUB_OUTPUT): file

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { fail, writeOutput } from './lib.mjs';

const DICTIONARIES_ROOT = process.env.DICTIONARIES_ROOT || 'dictionaries';
export const NEW_TERMS_MARKER = /please add new terms above this line/i;

/**
 * @param {string} dictionary
 * @param {string} dictionariesRoot
 * @returns {string}
 */
export function findDictionaryFile(dictionary, dictionariesRoot = DICTIONARIES_ROOT) {
    const srcDir = path.join(dictionariesRoot, dictionary, 'src');
    if (!existsSync(srcDir)) {
        fail(`Dictionary "${dictionary}" has no "src" directory.`);
    }

    const txtFiles = readdirSync(srcDir)
        .filter((file) => file.endsWith('.txt'))
        .map((file) => path.join(srcDir, file));

    if (txtFiles.length === 0) {
        fail(`No ".txt" source files were found in "${srcDir}".`);
    }

    if (txtFiles.length === 1) {
        return txtFiles[0];
    }

    const withMarker = txtFiles.filter((file) => NEW_TERMS_MARKER.test(readFileSync(file, 'utf8')));
    if (withMarker.length !== 1) {
        fail(
            `Dictionary "${dictionary}" has ${txtFiles.length} source files (${txtFiles.map((f) => path.basename(f)).join(', ')}) ` +
                'and the target file could not be determined automatically. Please open a manual pull request for this dictionary instead.',
        );
    }

    return withMarker[0];
}

function main() {
    const dictionary = process.env.DICTIONARY || '';
    const file = findDictionaryFile(dictionary);
    writeOutput('file', file);
    console.log(`Using "${file}" for dictionary "${dictionary}".`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    main();
}
