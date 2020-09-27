const fs = require('fs');
const path = require('path');

function readWords(filename) {
    const contents = fs.readFileSync(filename, 'utf8')
    return new Set(contents.split('\n').map(s => s.trim()).filter(s => !!s));
}

const addedWordsFile = path.join(__dirname, 'en_US.txt');
const hunspellWordsFile = path.join(__dirname, 'hunspell_words.txt');

const added = readWords(addedWordsFile);
const hunspell = readWords(hunspellWordsFile);

const diff = [...added].filter(w => !hunspell.has(w));

fs.writeFileSync(path.join(__dirname, "diff.txt"), diff.join('\n') + '\n', 'utf8')
