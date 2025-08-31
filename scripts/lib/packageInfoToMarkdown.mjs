// ts-check

import { formatMarkdown } from './formatMarkdown.mjs';
import { unindent } from './utils.mjs';

/**
 * @typedef {import('./dictionaryInfo.mjs').DictionaryPackageInfo} DictionaryPackageInfo
 */

/**
 * @typedef {import('./dictionaryInfo.mjs').DictionaryInfo} DictionaryInfo
 */

const categoryToTitle = new Map([
    ['natural-language', 'Natural Language Dictionaries'],
    ['programming', 'Programming Dictionaries'],
    ['other', 'Specialized Dictionaries'],
    ['default', 'Default Dictionaries'],
    ['bundle', 'Dictionary Bundles'],
]);

/**
 *
 * @param {DictionaryPackageInfo[]} packages
 * @returns {Promise<string>}
 */
export async function packageInfoToMarkdown(packages) {
    packages = [...packages].sort((a, b) => a.name.localeCompare(b.name));

    let md = '<!--- Use `pnpm build:readme` to generate this table --->\n\n';
    md += listDictionariesByCategory(packages);
    md += extractDictionaryTable(packages);
    md += listDictionaryIds(packages);

    return formatMarkdown(md);
}

/**
 * List dictionaries by category
 * @param {DictionaryPackageInfo[]} packages
 * @returns {Promise<string>}
 */
function listDictionariesByCategory(packages) {
    const seen = new Set();
    const categories = new Set(['natural-language', 'programming', 'other', 'bundle']);
    const byCategory = groupByCategory(packages);

    let md = '';

    for (const category of categories) {
        const list = byCategory.get(category);
        if (!list) continue;
        const filtered = list.filter((pkg) => !seen.has(pkg));
        filtered.forEach((pkg) => seen.add(pkg));
        md += formatCategory(category, filtered);
    }

    for (const [category, list] of byCategory) {
        if (categories.has(category)) continue;
        const filtered = list.filter((pkg) => !seen.has(pkg));
        filtered.forEach((pkg) => seen.add(pkg));
        md += formatCategory(category, filtered);
    }

    md +=
        '\n\n' +
        '<sup>1</sup> Bundled with CSpell.<br>' +
        '<sup>2</sup> Dictionaries are enabled when packages is imported.\n\n';

    return md;
}

/**
 * List dictionary IDs and descriptions.
 * @param {DictionaryPackageInfo[]} packages
 * @returns {Promise<string>}
 */
function listDictionaryIds(packages) {
    const dictionaries = packages
        .filter((pkg) => !pkg.isBundle)
        .flatMap((pkg) => pkg.dictionaries.map((d) => ({ ...d, pkg })))
        .filter((d) => !d.external)
        .sort((a, b) => a.name.localeCompare(b.name));
    let md = unindent`
        ## Sorted by Dictionary Name IDs

        | Name ID | Description | Locale | File Type |
        | ------- | ----------- | ------ | --------- |
    `;

    for (const dict of dictionaries) {
        const cspell = dict.pkg.cspell ? ' <sup>1</sup>' : '';
        const enabled = dict.enabled ? ' <sup>2</sup>' : '';
        const locales = dict.locales ? `${dict.locales.sort().join('<br>')}` : '-';
        const fileTypes = dict.fileTypes ? `${take(4, dict.fileTypes.sort()).join('<br>')}` : '-';
        // | Name | Description | Locale | File Type |
        md += `| [\`${dict.name}\`](${dict.pkg.dir})${cspell}${enabled} | ${dict.description} | ${locales} | ${fileTypes} |\n`;
    }

    md += unindent`

        <sup>1</sup> Bundled with CSpell.<br>
        <sup>2</sup> Dictionaries are enabled when packages is imported.

    `;

    return md;
}

/**
 *
 * @param {DictionaryPackageInfo[]} packages
 * @returns {string}
 */
function extractDictionaryTable(packages) {
    packages = [...packages].sort((a, b) => a.packageName.localeCompare(b.packageName));
    return unindent`
        ## All Dictionaries

        | Package | Name | Dictionary IDs |
        | ------- | ---- | -------------- |
        ${packages.map(formatPackageRow).join('\n')}

        <sup>1</sup> Bundled with CSpell.<br><sup>2</sup> Dictionaries are enabled when packages is imported.

    `;
}

/**
 *
 * @param {DictionaryPackageInfo} pkg
 * @returns {string}
 */
function formatPackageRow(pkg) {
    const { packageName, dictionaries, dir } = pkg;

    const dictNames = pkg.isBundle
        ? ''
        : dictionaries
              .filter((d) => !d.external)
              .map((d) => d.name + (d.enabled ? '<sup>2</sup>' : ''))
              .join('<br>');

    // | Package | Name | Dictionary IDs |
    return `| [${packageName}](./${dir}#readme)${pkg.cspell ? '<sup>1</sup>' : ''} | ${pkg.name} | ${dictNames} |`;
}

/**
 *
 * @param {string} category
 * @param {DictionaryPackageInfo[] | undefined} packages
 */
function formatCategory(category, packages) {
    if (!packages?.length) return '';

    const title = categoryToTitle.get(category) || category;
    return `## ${title}\n\n` + packages.map(formatPackage).join('\n') + '\n\n';
}

/**
 *
 * @param {DictionaryPackageInfo} pkg
 * @returns {string}
 */
function formatPackage(pkg) {
    return `- [${pkg.name}](${pkg.dir}) - ${pkg.description} ${pkg.cspell ? '<sup>1</sup>' : ''} ${pkg.hasEnabledByDefault ? '<sup>2</sup>' : ''}`;
}

/**
 *
 * @param {DictionaryPackageInfo[]} packages
 * @returns {Map<string, DictionaryPackageInfo[]>}
 */
function groupByCategory(packages) {
    const byCategory = new Map();
    for (const pkg of packages) {
        const categories = pkg.isBundle ? ['bundle'] : pkg.categories || [];
        if (categories.length === 0) {
            categories.push('other');
        }
        for (const category of categories) {
            const list = byCategory.get(category) || [];
            list.push(pkg);
            byCategory.set(category, list);
        }
    }
    return byCategory;
}

/**
 *
 * @param {number} n
 * @param {string[]} arr
 * @returns {string[]}
 */
function take(n, arr) {
    const result = arr.slice(0, n);
    if (result.length < arr.length) {
        result.push('...');
    }
    return result;
}
