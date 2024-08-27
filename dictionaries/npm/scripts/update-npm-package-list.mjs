#!/usr/bin/env node

/**
 * Read the list of npm packages and add all of their dependencies to the list
 */

// @ts-check

import fs from 'node:fs/promises';

import { getPackageDependencies } from './lib/get-package-dependencies.mjs';

const urlList = new URL('../src/npm.txt', import.meta.url);

const limit = 0;

/**
 * @typedef {{ value: string; comment: string }} Line
 */

/**
 *
 * @param {string} line
 * @returns {Line}
 */
function parseLine(line) {
    const match = line.match(/^([^#]*)(.*)$/);
    if (!match) {
        return { value: '', comment: '' };
    }
    const [, value, comment] = match;
    return { value: value.trim(), comment: comment.trim() };
}

function stringifyLine(line) {
    if (!line.value) return line.comment;
    return line.comment ? `${line.value} ${line.comment}` : line.value;
}

async function updateList() {
    const listContent = await fs.readFile(urlList, 'utf-8');
    const lines = listContent.split('\n').map(parseLine);
    /** @type {Line[]} */
    const linesOut = [];
    const knownPackages = new Set(lines.map((line) => line.value));
    /** @type {Set<string>} */
    const processedPackages = new Set();
    /** @type {Set<string>} */
    const newPackages = new Set();

    let count = 0;

    for (const line of lines) {
        linesOut.push(line);
        if (limit && count++ > limit) continue;
        if (line.value) {
            if (processedPackages.has(line.value)) continue;
            processedPackages.add(line.value);
            console.log('Processing: %s', line.value);
            const deps = await getPackageDependencies(line.value);
            if (!deps) {
                console.log('Not Found: %s', line.value);
                line.comment = '# Not Found';
                continue;
            }
            for (const dep of deps.dependencies) {
                if (knownPackages.has(dep) || dep.startsWith('@types/')) continue;
                !newPackages.has(dep) && console.log('Adding: %s', dep);
                newPackages.add(dep);
            }
            for (const dep of deps.devDependencies) {
                if (knownPackages.has(dep) || dep.startsWith('@')) continue;
                !newPackages.has(dep) && console.log('Adding: %s', dep);
                newPackages.add(dep);
            }
        }
    }

    const newLines = [...newPackages].sort().map((value) => ({ value, comment: '' }));
    linesOut.push(...newLines);

    const outContent = linesOut.map(stringifyLine).join('\n') + '\n';

    await fs.writeFile(urlList, outContent);
}

async function run() {
    try {
        return await updateList();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

run();
