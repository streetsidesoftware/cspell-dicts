import * as fs from 'node:fs/promises';
import * as path from 'node:path';

const root = path.resolve(import.meta.dirname, '../');
const mimeDbDir = path.resolve(root, 'src/mime-db/src');

main();

async function main() {
    const mimeTypes = new Set();
    const mimeTypesFiles = await readMimeTypesFiles();

    mimeTypesFiles.forEach((json) => {
        Object.keys(json).forEach((mimeType) => mimeTypes.add(mimeType));
    });

    const sortedMimeTypes = Array.from(mimeTypes).sort();

    await fs.writeFile(path.resolve(root, 'src/mime-types.txt'), sortedMimeTypes.join('\n'));
}

async function readMimeTypesFiles() {
    const dirEntries = await fs.readdir(mimeDbDir);

    const mimeTypesFiles = dirEntries.filter((file) => file.endsWith('.json'));

    return Promise.all(mimeTypesFiles.map(readJsonFile));
}

async function readJsonFile(fileName) {
    const filePath = path.resolve(mimeDbDir, fileName);
    const content = await fs.readFile(filePath, 'utf8');

    return JSON.parse(content);
}
