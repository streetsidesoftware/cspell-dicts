import fs from 'node:fs/promises';

import { stringify as csvStringify } from 'csv-stringify/sync';

/**
 * @param {URL | string} url
 * @param {Map<string, number>} refCounts
 */
export async function writePackageRefCountsCsv(url, refCounts) {
    const entries = [...refCounts.entries()]
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([pkg, count]) => ({ package: pkg, count }));
    await fs.writeFile(url, csvStringify(entries, { header: true }) + '\n');
}

/**
 * @param {URL | string} url
 * @param {Map<string, number>} refCounts
 */
export async function writeKeywordsCsv(url, refCounts) {
    const entries = [...refCounts.entries()]
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([key, count]) => ({ keyword: key, count }));
    await fs.writeFile(url, csvStringify(entries, { header: true }) + '\n');
}
