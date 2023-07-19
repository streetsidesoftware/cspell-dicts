#!/usr/bin/env node

import * as fs from 'fs';

const usageText = `
./toCaps.js <from_file> <to_file>
`;

function usage() {
    console.log(usageText);
}

function readFile(path) {
    try {
        return fs.readFileSync(path, 'utf-8');
    } catch (e) {
        console.error(e);
    }
    return undefined;
}

const sortFn = new Intl.Collator().sort;

function run() {
    if (process.argv.length !== 4) {
        usage();
        process.exit(1);
    }

    const srcFilename = process.argv[2];
    const dstFilename = process.argv[3];

    console.log(`Reading "${srcFilename}"`);
    const src = readFile(srcFilename);
    if (!src) {
        process.exit(1);
    }

    console.log('Processing...');
    const lines = src
        .split(/\n/g)
        .map((t) => t.trim())
        .filter((t) => t.toLocaleLowerCase('el') === t) // keep lowercase only words.
        .map((t) => t.normalize('NFC'))
        .filter((t) => t.toUpperCase() !== t.toLocaleUpperCase('el'));

    const result = new Set(lines.map((t) => t.toLocaleUpperCase('el')));

    console.log(`Writing ${result.size} words to "${dstFilename}"`);
    fs.writeFileSync(dstFilename, [...result].sort(sortFn).join('\n') + '\n');
}

run();
console.log('done.');
process.exit(0);
