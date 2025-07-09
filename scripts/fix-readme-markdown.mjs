#!/usr/bin/env node

// ts-check
import fs from 'node:fs/promises';
import { pathToFileURL, fileURLToPath } from 'node:url';

import { findDictionaryPackages } from './lib/find-dictionary-packages.mjs';

async function run() {
    const packages = await findDictionaryPackages();
    const readmeFiles = packages.map((file) => new URL('README.md', pathToFileURL(file)));

    for (const readmeFile of readmeFiles) {
        try {
            const content = await fs.readFile(readmeFile, 'utf8');
            const updatedContent = content.replaceAll('> \\[!NOTE]', '> [!NOTE]');
            if (content !== updatedContent) {
                console.log(`Updating ${fileURLToPath(readmeFile)}`);
                await fs.writeFile(readmeFile, updatedContent, 'utf8');
            }
        } catch (err) {
            console.error(`Failed to update ${fileURLToPath(readmeFile)}:`, err);
        }
    }
}

run();
