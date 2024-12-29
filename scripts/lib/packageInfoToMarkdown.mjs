// ts-check

import { formatMarkdown } from './formatMarkdown.mjs';

/**
 * @typedef {import('./dictionaryInfo.mjs').DictionaryPackageInfo} DictionaryPackageInfo
 */

const categoryToTitle = new Map([
    ['natural-language', 'Natural Language Dictionaries'],
    ['programming', 'Programming Dictionaries'],
    ['other', 'Specialized Dictionaries'],
    ['default', 'Default Dictionaries'],
]);

/**
 *
 * @param {DictionaryPackageInfo[]} packages
 * @returns {Promise<string>}
 */
export async function packageInfoToMarkdown(packages) {
    packages = packages.sort((a, b) => a.name.localeCompare(b.name));
    const seen = new Set();
    const categories = new Set(['natural-language', 'programming', 'other']);
    const byCategory = groupByCategory(packages);

    let md = '<!--- Use `pnpm build:readme` to generate this table --->\n\n';

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

    md += '\n\n<sup>*</sup> Bundled with CSpell\n\n';
    md += extractDictionaryTable(packages);

    return formatMarkdown(md);
}

/**
 *
 * @param {DictionaryPackageInfo[]} packages
 * @returns {string}
 */
function extractDictionaryTable(packages) {
    return `
## All Dictionaries

| package | dictionary ID | name | description |
| --- | --- | --- | --- |
${packages.map(formatPackageRow).join('\n')}
`;
}

function formatPackageRow(pkg) {
    const { packageName, dictionaries, dir } = pkg;
    // | package | dictionary ID | name | description |
    return `| [${packageName}](./${dir}#readme) | ${dictionaries.map((d) => d.name).join('<br>')} | ${pkg.name} | ${pkg.description} |`;
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
    return `- [${pkg.name}](${pkg.dir})${pkg.bundled ? '**<sup>*</sup>**' : ''}`;
}

/**
 *
 * @param {DictionaryPackageInfo[]} packages
 * @returns {Map<string, DictionaryPackageInfo[]>}
 */
function groupByCategory(packages) {
    const byCategory = new Map();
    for (const pkg of packages) {
        const categories = pkg.categories || [];
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
