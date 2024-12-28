import { promises as fs } from 'fs';

async function readFile(path, encoding = 'utf8') {
    try {
        return await fs.readFile(path, encoding);
    } catch {
        return '';
    }
}

async function appendWordsToFile(path, words) {
    const raw = await readFile(path);
    const content = raw.endsWith('\n') ? raw : raw + '\n';
    const lines = content.split('\n').slice(0, -1);
    const knownWords = new Set(lines);

    for (const word of words) {
        if (!word.trim()) continue;
        if (!knownWords.has(word)) {
            lines.push(word);
            knownWords.add(word);
        }
    }

    await fs.writeFile(path, lines.join('\n') + '\n');
}

function tLen(word) {
    return word.replaceAll(/(^_+)|(_+$)/g, '').length;
}

function filterByLength(lines, len) {
    return lines.filter((w) => tLen(w) === len);
}

function addToSet(setOfWords, words) {
    for (const word of words) {
        setOfWords.add(word);
    }
}

async function process() {
    const content = await readFile('./cpp.txt');

    const lines = content
        .split('\n')
        .map((a) => a.trim())
        .filter((a) => !!a);

    const minWordLen = 4;
    const removedWords = new Set();

    for (let len = 0; len < minWordLen; len++) {
        const words = filterByLength(lines, len);
        addToSet(removedWords, words);
        await appendWordsToFile(`./cpp${len}.txt`, words);
    }

    const words = lines.filter((w) => !removedWords.has(w));
    await fs.writeFile('./cpp.txt', words.join('\n') + '\n');
}

process();
