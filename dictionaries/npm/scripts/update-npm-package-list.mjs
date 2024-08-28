#!/usr/bin/env node

/**
 * Read the list of npm packages and add all of their dependencies to the list
 */

// @ts-check

import fs from 'node:fs/promises';

import { commonKeywords, getPackageDependencies, searchForPackagesByKeyword } from './lib/get-package-dependencies.mjs';
import { PackageDependencies } from './lib/PackageDependencies.mjs';

const urlList = new URL('../src/npm.txt', import.meta.url);
const urlPackagesInfo = new URL('../src/.npm-packages-info.json', import.meta.url);

const limit = 0;

/**
 * Minimum number of references to include in the list.
 * This is to prevent including packages that are not used by other packages.
 */
const minRefs = 10;

const staleEntry = 1000 * 60 * 60 * 24 * 30; // 30 days

const includeDevDependencies = true;

/**
 * @typedef {{ ts: number, dependencies?: string[] | undefined, devDependencies?: string[] | undefined }} PackageInfo
 * @typedef {{[key: string]: PackageInfo }} PackagesInfo
 * @typedef {{ value: string; comment: string }} Line
 */

/**
 * Read the list of packages and their dependencies.
 * @returns {Promise<PackageDependencies>}
 */
async function readPackagesInfo() {
    try {
        const content = await fs.readFile(urlPackagesInfo, 'utf-8');
        return PackageDependencies.fromJSON(JSON.parse(content));
    } catch {
        return new PackageDependencies();
    }
}

/**
 * Write the list of packages and
 * @param {PackageDependencies} info
 */
async function writePackagesDependencies(info) {
    // prettier will clean it up later.
    const content = JSON.stringify(info, null, 2) + '\n';
    await fs.writeFile(urlPackagesInfo, content);
}

/**
 *
 * @param {PackageInfo} info
 */
function cleanPackageInfo(info) {
    info.dependencies = info.dependencies?.length ? info.dependencies : undefined;
    info.devDependencies = info.devDependencies?.length ? info.devDependencies : undefined;
    return info;
}

/**
 * @param {PackageDependencies} packages
 * @param {string} packageName
 * @returns {Promise<PackageInfo | undefined>}
 */
async function getPackageInfo(packages, packageName) {
    const now = Date.now();

    let pInfo = packages.get(packageName);
    if (pInfo && now - pInfo.ts < staleEntry) return cleanPackageInfo(pInfo);

    const info = await getPackageDependencies(packageName);
    if (!info) {
        packages.set(packageName, { ts: now, nf: true });
        writePackagesDependencies(packages);
        return undefined;
    }

    const pkgInfo = cleanPackageInfo({ ...info, ts: now });
    packages.set(packageName, pkgInfo);
    writePackagesDependencies(packages);
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

    const outContent = linesOut.map(stringifyLine).join('\n').trim() + '\n';

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

    await queryPopular();

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
                line.value = '';
                line.comment = '';
                continue;
            }
            for (const dep of deps.dependencies || []) {
                if (knownPackages.has(dep) || dep.startsWith('@types/')) continue;
                addToNewPackages(dep);
            }
            if (includeDevDependencies) {
                for (const dep of deps.devDependencies || []) {
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

    return;

    async function queryPopular() {
        const requests = await Promise.all(commonKeywords.map((key) => searchForPackagesByKeyword(key)));
        const packages = new Set(requests.flat().sort());
        for (const pkg of packages) {
            if (knownPackages.has(pkg)) continue;
            lines.push({ value: pkg, comment: '' });
        }
    }

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
