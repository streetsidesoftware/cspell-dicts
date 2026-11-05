import * as md from '@streetsidesoftware/markdown-toolkit';

import type { DictionaryPackageInfo } from './dictionaryInfo.mts';
import { parseInline } from './parseInline.mts';

const categoryToTitle = new Map([
    ['natural-language', 'Natural Language Dictionaries'],
    ['programming', 'Programming Dictionaries'],
    ['other', 'Specialized Dictionaries'],
    ['default', 'Default Dictionaries'],
    ['bundle', 'Dictionary Bundles'],
]);

export function packageInfoToMarkdown(packages: DictionaryPackageInfo[]): string {
    packages = [...packages].sort((a, b) => a.name.localeCompare(b.name));

    return md
        .document(
            md.comment('Use `pnpm build:readme` to generate this table'),
            listDictionariesByCategory(packages),
            extractDictionaryTable(packages),
            listDictionaryIds(packages),
        )
        .toString();
}

/**
 * List dictionaries by category
 */
function listDictionariesByCategory(packages: DictionaryPackageInfo[]): md.BlockContent {
    const seen = new Set<DictionaryPackageInfo>();
    const categories = new Set(['natural-language', 'programming', 'other', 'bundle']);
    const byCategory = groupByCategory(packages);

    const sections: md.BlockContent[] = [];

    for (const category of categories) {
        const list = byCategory.get(category);
        if (!list) continue;
        const filtered = list.filter((pkg) => !seen.has(pkg));
        filtered.forEach((pkg) => seen.add(pkg));
        sections.push(formatCategory(category, filtered));
    }

    for (const [category, list] of byCategory) {
        if (categories.has(category)) continue;
        const filtered = list.filter((pkg) => !seen.has(pkg));
        filtered.forEach((pkg) => seen.add(pkg));
        sections.push(formatCategory(category, filtered));
    }

    return [sections, footnotes()];
}

/**
 * List dictionary IDs and descriptions.
 */
function listDictionaryIds(packages: DictionaryPackageInfo[]): md.AnyContent {
    const dictionaries = packages
        .filter((pkg) => !pkg.isBundle)
        .flatMap((pkg) => pkg.dictionaries.map((d) => ({ ...d, pkg })))
        .filter((d) => !d.external)
        .sort((a, b) => a.name.localeCompare(b.name));

    return [
        md.heading(2, 'Sorted by Dictionary Name IDs'),
        md.table(
            ['Name ID', 'Description', 'Locale', 'File Type'],
            dictionaries.map((dict) => [
                [
                    md.link(md.inlineCode(dict.name), `../${dict.pkg.dir}`),
                    dict.pkg.cspell ? [' ', md.sup('1')] : '',
                    dict.enabled ? [' ', md.sup('2')] : '',
                ],
                parseInline(dict.description || ''),
                dict.locales ? lines(dict.locales.sort()) : '-',
                dict.fileTypes ? lines(take(4, dict.fileTypes.sort())) : '-',
            ]),
        ),
        footnotes(),
    ];
}

function extractDictionaryTable(packages: DictionaryPackageInfo[]): md.AnyContent {
    packages = [...packages].sort((a, b) => a.packageName.localeCompare(b.packageName));
    return [
        md.heading(2, 'All Dictionaries'),
        md.table(['Package', 'Name', 'Dictionary IDs'], packages.map(formatPackageRow)),
        footnotes(),
    ];
}

function footnotes(): md.MDParagraph {
    return md.p(
        md.sup('1'),
        ' Bundled with CSpell.',
        md.br(),
        md.sup('2'),
        ' Dictionaries are enabled when packages is imported.',
    );
}

function formatPackageRow(pkg: DictionaryPackageInfo): md.InlineContent[] {
    const { packageName, dictionaries, dir } = pkg;

    const dictNames = pkg.isBundle
        ? ''
        : lines(dictionaries.filter((d) => !d.external).map((d) => [d.name, d.enabled ? md.sup('2') : '']));

    return [
        [md.link(packageName, `../${dir}#readme`), pkg.cspell ? md.sup('1') : ''],
        parseInline(pkg.name),
        dictNames,
    ];
}

function formatCategory(category: string, packages: DictionaryPackageInfo[] | undefined): md.BlockContent {
    if (!packages?.length) return [];

    const title = categoryToTitle.get(category) || category;
    return [md.heading(2, title), md.list(packages.map(formatPackage))];
}

function formatPackage(pkg: DictionaryPackageInfo): md.MDListItem {
    return md.li([
        md.link(pkg.name, `../${pkg.dir}`),
        ' - ',
        parseInline(pkg.description),
        pkg.cspell ? [' ', md.sup('1')] : '',
        pkg.hasEnabledByDefault ? [' ', md.sup('2')] : '',
    ]);
}

/** Puts each entry of a table cell on its own line. */
function lines(entries: md.InlineContent[]): md.InlineContent {
    return entries.map((entry, i) => (i ? [md.br(), entry] : entry));
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
