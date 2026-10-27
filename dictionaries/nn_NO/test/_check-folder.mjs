import test from 'ava';
import { checkText } from 'cspell';
import { readFile } from 'node:fs/promises';

async function flaggedWords(folder, file) {
    const result = await checkText(`${folder}/${file}`, { config: `${folder}/cspell.json` });
    return result.items.filter((item) => item.isError).map((item) => item.text);
}

/**
 * Checks that no word in `accepted.txt` and every word in `flagged.txt` is flagged.
 * cspell caches a dictionary without its `repMap`, so give each folder its own test file: AVA runs each file in its own
 * process.
 */
export function checkFolder(folder) {
    test(`accepts every word in ${folder}/accepted.txt`, async (t) => {
        t.deepEqual(await flaggedWords(folder, 'accepted.txt'), []);
    });

    test(`flags every word in ${folder}/flagged.txt`, async (t) => {
        const words = (await readFile(`${folder}/flagged.txt`, 'utf8')).split('\n').filter(Boolean);
        t.deepEqual(await flaggedWords(folder, 'flagged.txt'), words);
    });
}
