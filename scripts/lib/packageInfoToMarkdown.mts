import type { DictionaryPackageInfo } from './dictionaryInfo.mts';
import { formatMarkdown } from './formatMarkdown.mts';
import { unindent } from './utils.mts';

const categoryToTitle = new Map([
    ['natural-language', 'Natural Language Dictionaries'],
    ['programming', 'Programming Dictionaries'],
    ['other', 'Specialized Dictionaries'],
    ['default', 'Default Dictionaries'],
    ['bundle', 'Dictionary Bundles'],
]);

export async function packageInfoToMarkdown(packages: DictionaryPackageInfo[]): Promise<string> {
    packages = [...packages].sort((a, b) => a.name.localeCompare(b.name));

    let md = '<!--- Use `pnpm build:readme` to generate this table --->\n\n';
    md += listDictionariesByCategory(packages);
    md += extractDictionaryTable(packages);
    md += listDictionaryIds(packages);

    return formatMarkdown(md);
}

/**
 * List dictionaries by category
 */
function listDictionariesByCategory(packages: DictionaryPackageInfo[]): string {
    const seen = new Set<DictionaryPackageInfo>();
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
 */
function listDictionaryIds(packages: DictionaryPackageInfo[]): string {
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
        md += `| [\`${dict.name}\`](../${dict.pkg.dir})${cspell}${enabled} | ${dict.description} | ${locales} | ${fileTypes} |\n`;
    }

    md += unindent`

        <sup>1</sup> Bundled with CSpell.<br>
        <sup>2</sup> Dictionaries are enabled when packages is imported.

    `;

    return md;
}

function extractDictionaryTable(packages: DictionaryPackageInfo[]): string {
    packages = [...packages].sort((a, b) => a.packageName.localeCompare(b.packageName));
    return unindent`
        ## All Dictionaries

        | Package | Name | Dictionary IDs |
        | ------- | ---- | -------------- |
        ${packages.map(formatPackageRow).join('\n')}

        <sup>1</sup> Bundled with CSpell.<br><sup>2</sup> Dictionaries are enabled when packages is imported.

    `;
}

function formatPackageRow(pkg: DictionaryPackageInfo): string {
    const { packageName, dictionaries, dir } = pkg;

    const dictNames = pkg.isBundle
        ? ''
        : dictionaries
              .filter((d) => !d.external)
              .map((d) => d.name + (d.enabled ? '<sup>2</sup>' : ''))
              .join('<br>');

    // | Package | Name | Dictionary IDs |
    return `| [${packageName}](../${dir}#readme)${pkg.cspell ? '<sup>1</sup>' : ''} | ${pkg.name} | ${dictNames} |`;
}

function formatCategory(category: string, packages: DictionaryPackageInfo[] | undefined): string {
    if (!packages?.length) return '';

    const title = categoryToTitle.get(category) || category;
    return `## ${title}\n\n` + packages.map(formatPackage).join('\n') + '\n\n';
}

function formatPackage(pkg: DictionaryPackageInfo): string {
    return `- [${pkg.name}](../${pkg.dir}) - ${pkg.description} ${pkg.cspell ? '<sup>1</sup>' : ''} ${pkg.hasEnabledByDefault ? '<sup>2</sup>' : ''}`;
}

function groupByCategory(packages: DictionaryPackageInfo[]): Map<string, DictionaryPackageInfo[]> {
    const byCategory = new Map<string, DictionaryPackageInfo[]>();
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

function take(n: number, arr: string[]): string[] {
    const result = arr.slice(0, n);
    if (result.length < arr.length) {
        result.push('...');
    }
    return result;
}
