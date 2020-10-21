#!/usr/bin/env node

const fs =  require('fs');

const usageText = `
./toCaps.js <from_file> <to_file>
`

function usage() {
    console.log(usageText)
}

function readFile(path) {
    try {
        return fs.readFileSync(path, 'utf-8')
    } catch (e) {
        console.error(e);
    }
    return undefined;
}

function run() {
    if (process.argv.length !== 4) {
        usage();
        process.exit(1);
    }

    const srcFilename = process.argv[2];
    const dstFilename = process.argv[3];

    console.log(`Reading "${srcFilename}"`)
    const src = readFile(srcFilename);
    if (!src) {
        process.exit(1);
    }

    console.log("Processing...")
    const regexpGreekAllLower = /^[]$/
    const lines = src.split(/\n/g)
    .map(t => t.trim())
    .filter(t => t.toLocaleLowerCase('el') === t) // keep lowercase only words.
    .map(t => t.normalize('NFC'))
    .filter(t => t !== t.normalize("NFD"));
    const words = new Set(lines);
    const result = lines
    .map(t => t.toLocaleUpperCase('el'));

    console.log(`Writing ${result.length} words to "${dstFilename}"`)
    fs.writeFileSync(dstFilename, result.join('\n'));
}

run();
console.log("done.")
process.exit(0);
