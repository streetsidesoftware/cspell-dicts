#!/usr/bin/env node

// ts-check
import fs from 'node:fs/promises';
import { pathToFileURL, fileURLToPath } from 'node:url';

import { format } from 'prettier';

import { findDictionaryPackages } from './lib/find-dictionary-packages.mjs';
import { fetchDictionaryInfo } from './lib/dictionaryInfo.mjs';
import { packageInfoToMarkdown } from './lib/packageInfoToMarkdown.mjs';

const rootUrl = new URL('../', import.meta.url);

async function run() {
    const packages = await findDictionaryPackages();

    const packageInfo = await Promise.all(packages.map((file) => fetchDictionaryInfo(pathToFileURL(file))));
    packageInfo.sort((a, b) => a.dir.localeCompare(b.dir));

    const fileJsonURL = new URL('static/dictionary-packages.json', rootUrl);

    await fs.writeFile(
        fileJsonURL,
        await format(JSON.stringify(packageInfo, null, 2) + '\n', { filepath: fileURLToPath(fileJsonURL) }),
    );

    const fileMdURL = new URL('static/dictionary-packages.md', rootUrl);

    const md = await format(await packageInfoToMarkdown(packageInfo), { filepath: fileURLToPath(fileMdURL) });
    await fs.writeFile(fileMdURL, md);
}

run();
