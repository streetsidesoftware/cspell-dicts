#!/usr/bin/env node

// ts-check
import fs from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

import { findDictionaryPackages } from './lib/find-dictionary-packages.mjs';
import { fetchDictionaryInfo } from './lib/dictionaryInfo.mjs';
import { packageInfoToMarkdown } from './lib/packageInfoToMarkdown.mjs';

const rootUrl = new URL('../', import.meta.url);

async function run() {
    const packages = await findDictionaryPackages();

    const packageInfo = await Promise.all(packages.map((file) => fetchDictionaryInfo(pathToFileURL(file))));
    packageInfo.sort((a, b) => a.dir.localeCompare(b.dir));

    await fs.writeFile(
        new URL('static/dictionary-packages.json', rootUrl),
        JSON.stringify(packageInfo, null, 2) + '\n',
    );

    const md = await packageInfoToMarkdown(packageInfo);
    await fs.writeFile(new URL('static/dictionary-packages.md', rootUrl), md);
}

run();
