#!/usr/bin/env node

'use strict';

/**
 * This script was used to pair down the number of duplicate words in
 * en_US.txt and hunspell/en_US.dic.
 *
 * I might use it to generate an base english dictionary from both en_US and en_GB.
 * But it will need a bit of cleaning up first.
 */

const fs = require('fs');
const path = require('path');

function readWords(filename) {
    const contents = fs.readFileSync(filename, 'utf8')
    return new Set(contents.split('\n').map(s => s.trim()).filter(s => !!s));
}

const addedWordsFile = path.join('src', 'en_US.txt');
const hunspellWordsFile = path.join('src', 'hunspell_words.txt');

const added = readWords(addedWordsFile);
const hunspell = readWords(hunspellWordsFile);

const diff = [...added].filter(w => !hunspell.has(w));

fs.writeFileSync(path.join('src', 'diff.txt'), diff.join('\n') + '\n', 'utf8')
