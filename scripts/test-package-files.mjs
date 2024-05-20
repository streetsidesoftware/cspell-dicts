#!/usr/bin/env node
/* eslint-disable no-unused-vars, no-undef */

import { fileURLToPath } from 'url';
import { readFile, readdir, writeFile } from 'fs/promises';
import { findFiles } from './lib/findFiles.mjs';

const rootUrl = new URL('..', import.meta.url);
const root = fileURLToPath(rootUrl);
const cwd = root;

run();

async function findDictionaryExtFiles() {
    const files = await findFiles(['dictionaries/*/cspell-ext.json', { cwd, onlyFiles: true }]);
    return files;
}

async function run() {
    console.log('Test that package.json/files contains');
    const packages = await collectPackages();
    await updateManifest(packages);
    await updateConfig(packages);
    console.log('Done.');
}
