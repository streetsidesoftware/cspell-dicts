#!/usr/bin/env node

/**
 * Merge lists of words into a single list.
 */

import { program } from 'commander';
import { promises as fs } from 'fs';
import { sortSourceContent } from './lib/sortContent.mjs';

let info = console.log;

async function readAndMergeFiles(files) {
    let content = '';

    for (const file of files) {
        content += `## ${file}\n`;
        content += await fs.readFile(file, 'utf8');
    }

    return content;
}

function removeComments(content) {
    return content.replace(/#.*$/gm, '');
}

async function processFiles(files, excluded) {
    const mergedContent = await readAndMergeFiles(files);
    const excludedWords = removeComments(await readAndMergeFiles(excluded))
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => !!line);
    const exclude = new Set(excludedWords);

    if (!mergedContent.trim()) return;

    const lines = mergedContent
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => !exclude.has(removeComments(line).trim()));
    const content = lines.join('\n');

    const sorted = sortSourceContent(content).replace(/^(.*\n)\1+/gm, '$1');

    const filename = files[0];

    if (sorted === content) {
        info(`${filename} - ok`);
        return;
    }

    await fs.writeFile(filename, sorted, 'utf8');
    info(`${filename} - updated`);
}

program
    .name('merge')
    .description('Merge source files into a single list.')
    .argument('<files...>', 'files to read')
    .option('-x, --exclude <files...>', 'Files containing words to exclude.', [])
    .action(async (files, options) => {
        // console.log('%o', options);
        const ignore = options.exclude || [];
        await processFiles(files, ignore);
    });

program.parseAsync();
