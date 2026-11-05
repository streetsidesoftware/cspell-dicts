import { readFile } from 'node:fs/promises';

import test from 'ava';
import { checkText } from 'cspell';

for (const folder of ['test/nb-no', 'test/nb-no-alt']) {
    test(`accepts every word in ${folder}/accepted.words`, async (t) => {
        t.deepEqual(await flaggedWords(folder, 'accepted.words'), []);
    });

    test(`flags every word in ${folder}/flagged.words`, async (t) => {
        const words = (await readFile(`${folder}/flagged.words`, 'utf8')).split('\n').filter(Boolean);
        t.deepEqual(await flaggedWords(folder, 'flagged.words'), words);
    });
}

async function flaggedWords(folder, file) {
    const result = await checkText(`${folder}/${file}`, { config: `${folder}/cspell.json` });
    return result.items.filter((item) => item.isError).map((item) => item.text);
}
