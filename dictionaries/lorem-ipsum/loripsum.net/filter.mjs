import fs from 'node:fs';

async function run() {
    for (let i = 0; i < 1000; i++) {
        await process();
        await waitFor(250);
    }
}

async function process() {
    const knownWords = readWordFreq('./words.txt');
    const numWords = Math.max(knownWords.size - 1, 0);
    const wordCount = knownWords.get('*') || 0;

    console.log('Known words:', numWords);
    console.log('Total words:', wordCount);

    const sourceWords = await fetchWords();
    addWordsToFreqMap(knownWords, sourceWords);

    console.log('New words:', knownWords.size - numWords - 1);
    console.log('Added words:', knownWords.get('*') - wordCount);

    writeWordFreq('./words.txt', knownWords);
}

function readFile(path) {
    try {
        return fs.readFileSync(path, 'utf8');
    } catch {
        return undefined;
    }
}

/**
 *
 * @param {string} text
 * @returns {string[]}
 */
function textToWords(text) {
    const words = text
        .replaceAll(/[^a-zA-Z]/g, ' ')
        .toLowerCase()
        .split(' ')
        .filter((a) => a);
    return words;
}

async function fetchWords() {
    const response = await fetch('https://loripsum.net/api/20/verylong/plaintext');
    const text = await response.text();
    return textToWords(text);
}

/**
 *
 * @param {string} path
 * @returns {Map<string, number>}
 */
function readWordFreq(path) {
    const text = readFile(path) || '';
    const freq = new Map();
    text.split('\n').forEach((line) => {
        if (!line.trim()) return;
        const [word, count] = line.split(',');
        freq.set(word, Number(count));
    });
    return freq;
}

function writeWordFreq(path, freqMap) {
    const lines = [...freqMap.entries()].map(([word, count]) => `${word},${count}`);
    fs.writeFileSync(path, lines.sort().join('\n'));
}

function waitFor(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function addWordsToFreqMap(map, words) {
    for (const word of words) {
        addWordToFreqMap(map, word);
    }
}

function addWordToFreqMap(map, key, n = 1) {
    const v = map.get(key) || 0;
    map.set(key, v + n);
    const t = map.get('*') || 0;
    map.set('*', t + n);
}

run();
