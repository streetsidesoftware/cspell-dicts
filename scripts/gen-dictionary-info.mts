#!/usr/bin/env node

import fs from 'node:fs/promises';
import { pathToFileURL, fileURLToPath } from 'node:url';

import { format } from 'prettier';

import { findDictionaryPackages } from './lib/find-dictionary-packages.mts';
import { fetchDictionaryInfo } from './lib/dictionaryInfo.mts';
import { packageInfoToMarkdown } from './lib/packageInfoToMarkdown.mts';
import { writeStaticFilesForPackages } from './lib/gen-dict-static-files.mts';

const rootUrl = new URL('../', import.meta.url);

async function run() {
    const packages = await findDictionaryPackages();

    const packageInfo = (await Promise.all(packages.map((file) => fetchDictionaryInfo(pathToFileURL(file))))).filter(
        (a) => !!a,
    );
    packageInfo.sort((a, b) => a.dir.localeCompare(b.dir));

    await writeStaticFilesForPackages(packageInfo);

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
