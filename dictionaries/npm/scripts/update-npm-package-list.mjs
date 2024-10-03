#!/usr/bin/env node

/**
 * Read the list of npm packages and add all of their dependencies to the list
 */

// @ts-check

import fs from 'node:fs/promises';

import { commonKeywords, getPackageDependencies, searchForPackagesByKeyword } from './lib/get-package-dependencies.mjs';
import { PackageDependencies } from './lib/PackageDependencies.mjs';
import { writeKeywordsCsv, writePackageRefCountsCsv } from './lib/util.mjs';

const urlList = new URL('../src/npm.txt', import.meta.url);
const urlPackagesInfo = new URL('../src/npm/.npm-packages-info.json', import.meta.url);
const urlPackageRecCounts = new URL('../src/npm/.npm-package-ref-counts.csv', import.meta.url);
const urlKeywords = new URL('../src/npm/.npm-keywords.csv', import.meta.url);

const limit = 0;

let silent = false;

function consoleLog(...args) {
    if (!silent) {
        console.log(...args);
    }
}

/**
 * Minimum number of references to include in the list.
 * This is to prevent including packages that are not used by other packages.
 */
const autoIncludeMinNumRefs = 20;

const lowRefCount = 5;
const markLowRefCount = false;
const addRefCounts = false;

const msPerDay = 1000 * 60 * 60 * 24;
const staleEntry = msPerDay * 30;
const staleDither = 0.4 * staleEntry;

const includeDevDependencies = true;

const compare = new Intl.Collator('en').compare;

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
    await fs.writeFile(urlPackagesInfo, info.stringify());
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
    if (pInfo && !isStale(pInfo)) {
        const info = cleanPackageInfo(pInfo);
        packages.set(packageName, info);
        return info;
    }

    const info = await getPackageDependencies(packageName);
    if (!info) {
        packages.set(packageName, { ts: now, nf: true });
        await writePackagesDependencies(packages);
        return undefined;
    }

    const pkgInfo = cleanPackageInfo({ ...info, ts: now });
    packages.set(packageName, pkgInfo);
    await writePackagesDependencies(packages);
    return pkgInfo;
}

/**
 * Check if the package info is stale.
 * A dither is used to spread out the updates.
 * @param {PackageInfo} info
 * @returns
 */
function isStale(info) {
    const stale = Date.now() - info.ts > staleEntry - Math.random() * staleDither;
    // if (stale) {
    //     consoleLog('Stale: %o', info);
    // }
    return stale;
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

/**
 *
 * @param {Line[]} lines
 */
function sortLines(lines) {
    const idx = new Map(lines.map((line, i) => [line, i]));
    return lines
        .filter((a) => a.value || a.comment)
        .sort((a, b) => compare(a.value, b.value) || (idx.get(a) || 0) - (idx.get(b) || 0));
}

function stringifyLine(line) {
    if (!line.value) return line.comment;
    return line.comment ? `${line.value} ${line.comment}` : line.value;
}

/**
 * @param {PackageDependencies} packageDep
 * @param {Line[]} lines
 * @param {Set<string>} newPackages
 */
async function writeList(packageDep, lines, newPackages) {
    const newLines = [...newPackages]
        .filter((name) => packageDep.has(name) && packageDep.getRefCount(name) >= autoIncludeMinNumRefs)
        .map((name) => ({ value: name, comment: addRefCounts ? `# count ${packageDep.getRefCount(name)}` : '' }));
    const linesOut = sortLines([...lines, ...newLines]);

    const outContent =
        linesOut
            .map(stringifyLine)
            .filter((a) => !!a)
            .join('\n')
            .trim() + '\n';

    await fs.writeFile(urlList, outContent);
}

const formatPackageInfoOnly = false;

async function updateList() {
    const listContent = await fs.readFile(urlList, 'utf-8');
    const lines = listContent.split('\n').map(parseLine);
    const knownPackages = new Set(lines.map((line) => line.value));
    /** @type {Set<string>} */
    const processedPackages = new Set();
    /** @type {Set<string>} */
    const newPackages = new Set();

    const packagesInfo = await readPackagesInfo();

    await writePackagesDependencies(packagesInfo);
    if (formatPackageInfoOnly) return;

    await queryPopular();

    let count = 0;

    for (const line of lines) {
        const newCount = newPackages.size;
        if (limit && count++ > limit) break;
        const pkgName = line.value;
        if (pkgName) {
            if (processedPackages.has(pkgName)) continue;
            processedPackages.add(pkgName);
            consoleLog('Processing: %s', pkgName);
            const deps = await getPackageInfo(packagesInfo, pkgName);
            if (!deps) {
                consoleLog('Not Found: %s', pkgName);
                line.value = '';
                line.comment = '';
                continue;
            }
            if (markLowRefCount && packagesInfo.getRefCount(pkgName) < lowRefCount) {
                line.comment = `# Low Ref Count ${packagesInfo.getRefCount(pkgName)}`;
            } else if (line.comment.startsWith('# Low Ref Count')) {
                line.comment = '';
            }
            for (const dep of deps.dependencies || []) {
                if (knownPackages.has(dep) || dep.startsWith('@types/')) continue;
                await addToNewPackages(dep);
            }
            if (includeDevDependencies) {
                for (const dep of deps.devDependencies || []) {
                    if (knownPackages.has(dep) || dep.startsWith('@')) continue;
                    await addToNewPackages(dep);
                }
            }
        }
        if (newCount !== newPackages.size) {
            await writeList(packagesInfo, lines, newPackages);
        }
    }

    await writeList(packagesInfo, lines, newPackages);
    await writePackageRefCountsCsv(urlPackageRecCounts, packagesInfo.packageRefCounts);
    await writeKeywordsCsv(urlKeywords, packagesInfo.keywords);

    return newPackages.size;

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
    async function addToNewPackages(dep) {
        newPackages.add(dep);
        if (packagesInfo.getRefCount(dep) < autoIncludeMinNumRefs) return;

        consoleLog('Adding: %s', dep);
        // Fetch the package into
        await getPackageInfo(packagesInfo, dep);
    }
}

async function run() {
    try {
        const args = [...process.argv];
        silent = args.includes('--silent');

        const startTime = Date.now();
        while (Date.now() - startTime < 10000) {
            if (!(await updateList())) break;
        }
    } catch (e) {
        console.error(e);
        process.exitCode = 1;
    }
}

run();
