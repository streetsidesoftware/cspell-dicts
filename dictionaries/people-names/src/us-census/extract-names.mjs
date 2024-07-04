// @ts-check
import { promises as fs } from 'fs';

import { loadWordFreqCollection } from '@internal/en-freq';

/** @import { WordFreqCollection } from "@internal/en-freq" */

/**
 * @typedef {{name: string; count: number; rank: number; prop100k: number, cum_prop100k: number}} CensusRecord
 */

const compare = Intl.Collator('en-US').compare;

const urlOutput = new URL('../us-census.txt', import.meta.url);
const urlDataSurnames = new URL('./Names_2010Census.csv', import.meta.url);
const urlDataGivenNames = new URL('./given-names.txt', import.meta.url);

async function run() {
    const freq = await loadWordFreqCollection();
    const data = await readData();
    const rawNames = data.filter(row => row.rank > 0 && row.cum_prop100k <= 80000).map(row => row.name);

    const givenNames = (await readGivenNames()).map(name => correctName(name, freq, 1.0)).flat();
    const surnames = rawNames.map(name => correctName(name, freq)).flat();

    const names = [...new Set([...surnames, ...givenNames])].sort(compare);

    const out = '# US Census Names 2010\n' +
        '# It contains Surnames for 80% of the Population and over 5000 Given Names.\n' +
        '# Auto Generated: DO NOT EDIT.\n' +
        names.join('\n') + '\n';
    await fs.writeFile(urlOutput, out);
}

/**
 *
 * @param {string} name
 * @param {WordFreqCollection} freq
 * @param {number} minFreq
 * @returns {string[]}
 */
function correctName(name, freq, minFreq = 0.0001) {
    const found = freq.search(name)?.filter(f => f[1] > minFreq).map(f => f[0]);
    if (!found?.length) return [titleCase(name)];

    return found.map(f => f.toLowerCase() === f ? titleCase(f) : f).filter(f => f.toUpperCase() !== f);
}

/**
 *
 * @param {string} name
 * @returns {string}
 */
function titleCase(name) {
    return name[0].toUpperCase() + name.slice(1).toLowerCase();
}

/**
 * @returns {Promise<CensusRecord[]>}
 */
async function readData() {
// Header: name,rank,count,prop100k,cum_prop100k,pctwhite,pctblack,pctapi,pctaian,pct2prace,pcthispanic
    const content = await fs.readFile(urlDataSurnames, 'utf-8');
    const lines = content.split('\n');
    const rawData = lines.map(line => line.split(',')).filter(row => row.length > 5);
    const header = rawData[0];
    const data = rawData.slice(1).map(row => {
        /**
         *
         * @param {number} i
         * @returns
         */
        function getCol(i) {
            const v = row[i];
            if (i < 1) return v;
            return parseFloat(v);
        }

        const obj =
            /** @type {CensusRecord} */
            (Object.fromEntries(header.map((key, i) => [key, getCol(i)])));
        return obj;
    });

    return data;
}


async function readGivenNames() {
    const content = await fs.readFile(urlDataGivenNames, 'utf-8');

    const names = content.split('\n').map(line => line.trim()).filter(line => line).map(titleCase);
    return names;
}


run();
