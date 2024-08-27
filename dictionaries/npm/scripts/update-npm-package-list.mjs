#!/usr/bin/env node

/**
 * Read the list of npm packages and add all of their dependencies to the list
 */

// @ts-check

import fs from 'node:fs/promises';

import { getPackageDependencies } from './lib/get-package-dependencies.mjs';

const urlList = new URL('../src/npm.txt', import.meta.url);
const urlPackagesInfo = new URL('../src/.npm-packages-info.json', import.meta.url);

const limit = 0;

/**
 * Minimum number of references to include in the list.
 * This is to prevent including packages that are not used by other packages.
 */
const minRefs = 5;

const staleEntry = 1000 * 60 * 60 * 24 * 30; // 30 days

const includeDevDependencies = true;

/**
 * @typedef {{ ts: number, dependencies: string[], devDependencies: string[] }} PackageInfo
 * @typedef {{ value: string; comment: string }} Line
 * @typedef {{[key: string]: PackageInfo }} PackagesInfo
 */

/**
 * Read the list of packages and their dependencies.
 * @returns {Promise<PackagesInfo>}
 */
async function readPackagesInfo() {
    try {
        const content = await fs.readFile(urlPackagesInfo, 'utf-8');
        return JSON.parse(content);
    } catch {
        return {};
    }
}

/**
 * Write the list of packages and
 * @param {PackagesInfo} info
 */
async function writePackagesInfo(info) {
    const content = JSON.stringify(info, null, 2) + '\n';
    await fs.writeFile(urlPackagesInfo, content);
}

/**
 * @param {PackagesInfo} packages
 * @param {string} packageName
 * @returns {Promise<PackageInfo | undefined>}
 */
async function getPackageInfo(packages, packageName) {
    const now = Date.now();

    if (packages[packageName] && now - packages[packageName].ts < staleEntry) return packages[packageName];

    const info = await getPackageDependencies(packageName);
    if (!info) return undefined;

    const pkgInfo = { ...info, ts: now };
    packages[packageName] = pkgInfo;
    writePackagesInfo(packages);
    return pkgInfo;
}

/**
 *
 * @param {string} line
 * @returns {Line}
 */
function parseLine(line) {
    const match = line.match(/^([^#]*)(.*)$/);
    if (!match) {
        return { value: '', comment: '' };
    }
    const [, value, comment] = match;
    return { value: value.trim(), comment: comment.trim() };
}

function stringifyLine(line) {
    if (!line.value) return line.comment;
    return line.comment ? `${line.value} ${line.comment}` : line.value;
}

/**
 *
 * @param {Line[]} lines
 * @param {Map<string, number>} newPackages
 */
async function writeList(lines, newPackages) {
    const newLines = [...newPackages]
        .filter(([, c]) => c >= minRefs)
        .map(([name]) => name)
        .sort()
        .map((value) => ({ value, comment: '' }));
    const linesOut = [...lines, ...newLines];

    const outContent = linesOut.map(stringifyLine).join('\n') + '\n';

    await fs.writeFile(urlList, outContent);
}

async function updateList() {
    const listContent = await fs.readFile(urlList, 'utf-8');
    const lines = listContent.split('\n').map(parseLine);
    const knownPackages = new Set(lines.map((line) => line.value));
    /** @type {Set<string>} */
    const processedPackages = new Set();
    /** @type {Map<string, number>} */
    const newPackages = new Map();

    const packagesInfo = await readPackagesInfo();

    /**
     *
     * @param {string} dep
     */
    function addToNewPackages(dep) {
        const c = newPackages.get(dep) || 0;
        const n = c + 1;
        if (n == minRefs) console.log('Adding: %s', dep);
        newPackages.set(dep, n);
    }

    let count = 0;

    for (const line of lines) {
        const newCount = newPackages.size;
        if (limit && count++ > limit) break;
        if (line.value) {
            if (processedPackages.has(line.value)) continue;
            processedPackages.add(line.value);
            console.log('Processing: %s', line.value);
            const deps = await getPackageInfo(packagesInfo, line.value);
            if (!deps) {
                console.log('Not Found: %s', line.value);
                line.comment = '# Not Found';
                continue;
            }
            for (const dep of deps.dependencies) {
                if (knownPackages.has(dep) || dep.startsWith('@types/')) continue;
                addToNewPackages(dep);
            }
            if (includeDevDependencies) {
                for (const dep of deps.devDependencies) {
                    if (knownPackages.has(dep) || dep.startsWith('@')) continue;
                    addToNewPackages(dep);
                }
            }
        }
        if (newCount !== newPackages.size) {
            await writeList(lines, newPackages);
        }
    }

    await writeList(lines, newPackages);
}

async function run() {
    try {
        return await updateList();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

run();
