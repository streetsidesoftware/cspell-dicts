#!/usr/bin/env node

'use strict';

/**
 * This script tries to extract word relevant to the NodeJS API into a text file that
 * can be used to generate a dictionary file.
 *
 * It is designed to scan the markdown files used to document the Node API and extract
 * text between the back ticks ``
 *
 * It reads all files given on the command line into a single text file.
 *
 * Note: this script doesn't try to be perfect. The goal is to get a good representation of
 * the API while trying to avoid any misspellings that might be in the general text.
 *
 */

const fs = require('fs');

function processFile(file) {
    const content = fs.readFileSync(file, 'utf8');
    const words = extract(content);
    return `
# From ${file}

${words}
`;
}

function processFiles(files) {
    const fileContents = [];
    for (const file of files) {
        fileContents.push(processFile(file));
    }

    const content = `
# NodeJS Terms and phrases
#
# cspell:dictionaries node
# cspell-tools: split keep-case

${fileContents.join('\n')}
`;

    fs.writeFileSync('node.txt', content);
}

/**
 * @param {string} content
 */
function extract(content) {
    const regexpCodeBlock = /(```)[\s\S]+?\1/g;
    const regexpMetaData = /<!--[\s\S]+?-->/g;
    const regexpUnicode = /U\+[0-9A-F]{4}|0x[0-9A-F]{2,4}/gi;

    let text = content;
    text = text.replace(/\r\n/g, '\n');
    text = text.replace(/\r/g, '\n');

    // Ignore example code blocks
    text = text.replace(regexpCodeBlock, '');

    // Ignore Document Mega Data
    text = text.replace(regexpMetaData, '');

    // Remove Unicode
    text = text.replace(regexpUnicode, '');

    text = text
        .split('\n')
        .map((text) => text.replace(/<code>(.*)<\/code>/, '`$&`'))
        .map((text) => text.replace(/^[^`]+$/gm, ''))
        .map((text) => text.replace(/[^`]*`([^`]*)`[^`\n]*/gm, '<<<$1>>>\n'))
        .join('\n');

    text = text
        .split('\n')
        .filter((text) => text.match(/<<<(.*?)>>>/))
        .map((text) => text.replace(/^[^A-Z]*$/gim, ''))
        .map((text) => text.replace(/[#']+/g, ' '))
        .map((text) => text.replace(/.*?<<<(.*?)>>>.*?/, '$1'))
        .map((text) => text.trim())
        .filter((t) => !!t)
        .sort()
        .join('\n');

    // Remove duplicate lines
    text = text.replace(/(.*\n)\1+/g, '$1');

    return text;
}

processFiles(process.argv.slice(2));
