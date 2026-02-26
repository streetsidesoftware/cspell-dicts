// @ts-check

import fs from 'node:fs/promises';
import path from 'node:path';
import { sortSourceContent } from 'cspell-dicts-scripts/lib/sortContent.mjs';

const root = path.resolve(import.meta.dirname, '../');
const mimeDbDir = path.resolve(root, 'src/mime-db/src');

main();

async function main() {
    const mimeTypesFiles = await readMimeTypesFiles();
    const mimeTypes = new Set(mimeTypesFiles.map((json) => Object.keys(json)).flat());
    const content = '# Generated List of mime-types\n' + [...mimeTypes].join('\n') + '\n';
    const sortedContent = sortSourceContent(content);

    await fs.writeFile(path.resolve(root, 'src/mime-types.txt'), sortedContent);
}

/**
 * @returns {Promise<Record<string, unknown>[]>}
 */
async function readMimeTypesFiles() {
    const dirEntries = await fs.readdir(mimeDbDir);

    const mimeTypesFiles = dirEntries.filter((file) => file.endsWith('.json'));

    return Promise.all(mimeTypesFiles.map(readJsonFile));
}

/**
 *
 * @param {string} fileName
 * @returns
 */
async function readJsonFile(fileName) {
    const filePath = path.resolve(mimeDbDir, fileName);
    const content = await fs.readFile(filePath, 'utf8');

    return JSON.parse(content);
}
