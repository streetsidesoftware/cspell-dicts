#!/usr/bin/env node

// Phase 6: insert new words into a dictionary source file.
//
// Words are inserted above the trailing "Please add new terms above this
// line" comment block when one exists (preserving it), or simply appended
// to the end of the file otherwise (most dictionaries in this repo don't
// have that marker). Words already present in the file (exact match,
// ignoring comment lines) are silently skipped. No sorting happens here -
// `pnpm run lint:fix:sort-source-files` does that afterwards.
//
// Input: $TARGET_FILE (from find-dictionary-file.mjs), $WORDS_JSON (from
// parse-issue.mjs)
// Output (via $GITHUB_OUTPUT): added (JSON array), skipped (JSON array)

import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { writeOutput } from './lib.mjs';
import { NEW_TERMS_MARKER } from './find-dictionary-file.mjs';

/**
 * @param {string} content
 * @param {string[]} words
 * @returns {{ content: string, added: string[] }}
 */
export function insertWords(content, words) {
    const existing = new Set(
        content
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter((line) => line && !line.startsWith('#')),
    );

    const added = words.filter((word) => !existing.has(word));
    if (added.length === 0) {
        return { content, added };
    }

    const lines = content.split(/\r?\n/);
    const markerIndex = lines.findIndex((line) => NEW_TERMS_MARKER.test(line));

    if (markerIndex === -1) {
        const trimmed = content.replace(/\s+$/, '');
        return { content: `${trimmed}\n${added.join('\n')}\n`, added };
    }

    const before = lines.slice(0, markerIndex);
    while (before.length && before[before.length - 1].trim() === '') before.pop();
    const after = lines.slice(markerIndex);

    const result = [...before, ...added, '', ...after].join('\n');
    return { content: result.endsWith('\n') ? result : `${result}\n`, added };
}

function main() {
    const file = process.env.TARGET_FILE || '';
    const words = JSON.parse(process.env.WORDS_JSON || '[]');

    const original = readFileSync(file, 'utf8');
    const { content, added } = insertWords(original, words);
    const skipped = words.filter((word) => !added.includes(word));

    if (added.length === 0) {
        console.log('All submitted words already exist in the dictionary. Nothing to do.');
        writeOutput('added', JSON.stringify([]));
        writeOutput('skipped', JSON.stringify(skipped));
        return;
    }

    writeFileSync(file, content, 'utf8');

    writeOutput('added', JSON.stringify(added));
    writeOutput('skipped', JSON.stringify(skipped));
    console.log(`Added ${added.length} word(s) to ${file}: ${added.join(', ')}`);
    if (skipped.length) {
        console.log(`Skipped ${skipped.length} word(s) already present: ${skipped.join(', ')}`);
    }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    main();
}
