import { promises as fs } from 'fs';

async function process() {
    const content = await fs.readFile('./cpp-legacy-words.txt', 'utf8');
    const lines = content
        .split('\n')
        .map((a) => a.trim())
        .filter((a) => !!a);

    const wordSet = new Set(lines);

    const words = lines.filter((w) => {
        const lc = w.toLowerCase();
        return lc === w || !wordSet.has(lc);
    });

    console.log(words.join('\n'));
}

process();
