import fs from 'node:fs/promises';
import path from 'node:path/posix';

import type { CSpellSettings, RegExpPatternDefinition } from '@cspell/cspell-types';
import bundledWithCSpell from '@cspell/cspell-bundled-dicts';
import { readConfigFile, resolveConfigFileImports } from 'cspell-lib';
import json5 from 'json5';

const rootUrl = new URL('../../', import.meta.url);

type CSpellConfigFile = Awaited<ReturnType<typeof readConfigFile>>;

/**
 * Locale/FileType Pair.
 */
export interface LocaleFileTypePair {
    /** The locale of the dictionary. */
    locale: string;
    /** The file type of the dictionary. */
    fileType: string;
}

/**
 * Dictionary information.
 */
export interface DictionaryInfo {
    /** The name of the dictionary. */
    name: string;
    /** The description of the dictionary. */
    description?: string | undefined;
    /** The locales supported by the dictionary. */
    locales?: string[] | undefined;
    /** The dictionary is enabled for the following file types. */
    fileTypes?: string[] | undefined;
    /** The dictionary is enabled for the following locale/file type pairs. */
    localeFileTypes?: LocaleFileTypePair[] | undefined;
    /** The dictionary is enabled by default. */
    enabled?: boolean | undefined;
    /** The dictionary is defined in an external package. */
    external?: boolean | undefined;
}

/**
 * Dictionary Package information.
 */
export interface DictionaryPackageInfo {
    /** The name of the dictionary. */
    name: string;
    /** The version of the package. */
    version: string;
    /** The name of the package. */
    packageName: string;
    /** The directory containing the dictionary package. */
    dir: string;
    /** The dictionary package is bundled with cspell. */
    cspell: boolean;
    /** The description of the package. */
    description: string;
    /** The category of the package. (e.g. programming, natural-language) */
    categories: string[];
    /** The dictionaries in the package. */
    dictionaries: DictionaryInfo[];
    /** The dictionary package is a bundle of other packages. */
    isBundle?: boolean | undefined;
    /** The dictionary package has dictionaries enabled by default. */
    hasEnabledByDefault?: boolean | undefined;
    /** The patterns defined by the dictionary. */
    patterns?: RegExpPatternDefinition[] | undefined;
}

const cspellBundle: CSpellSettings = bundledWithCSpell;

const defaultCSpellImports = new Set(extractImports(cspellBundle));

export async function fetchDictionaryInfo(dictURL: URL): Promise<DictionaryPackageInfo | undefined> {
    dictURL = new URL('./', dictURL);
    const pkgUrl = new URL('package.json', dictURL);

    const pkgJson = await readJson(pkgUrl);
    const extFile = pkgJson.exports?.['.'] || 'cspell-ext.json';
    const cspellExtUrl = new URL(extFile, dictURL);
    const extConfigFile = await readConfigFileOrUndefined(cspellExtUrl);
    if (!extConfigFile) {
        return undefined;
    }
    const cspellExt: CSpellSettings = extConfigFile.settings;
    const isBundle = extractImports(cspellExt).filter((i) => i.startsWith('@cspell/')).length > 2 || undefined;
    // Remove package imports from the list of imports.
    extConfigFile.settings.import = Array.isArray(extConfigFile.settings.import)
        ? extConfigFile.settings.import.filter((i) => i.startsWith('./'))
        : extConfigFile.settings.import;

    const cspellSettings = await resolveConfigFileImports(extConfigFile);
    const dictionaries = extractDictionaryInfo(cspellSettings);
    const hasEnabledByDefault = dictionaries.some((d) => d.enabled) || undefined;
    return {
        name: cspellExt.name || pkgJson.name,
        version: pkgJson.version,
        dir: path.relative(rootUrl.pathname, dictURL.pathname),
        packageName: pkgJson.name,
        description: cspellExt.description || pkgJson.description || '',
        cspell: defaultCSpellImports.has(pkgJson.name),
        categories: extractCategories(pkgJson, dictionaries),
        dictionaries,
        isBundle,
        hasEnabledByDefault,
        patterns: cspellSettings.patterns || [],
    };
}

async function readConfigFileOrUndefined(cspellExtUrl: URL): Promise<CSpellConfigFile | undefined> {
    try {
        return await readConfigFile(cspellExtUrl);
    } catch (e) {
        const err = e as NodeJS.ErrnoException & { cause?: { code?: string } };
        if (err.code === 'ENOENT' || err.cause?.code === 'ENOENT') {
            return undefined;
        }
        console.error(`Error reading config file: ${cspellExtUrl} - ${err.message} %o`, e);
        throw e;
    }
}

export function extractDictionaryInfo(cspellSettings: CSpellSettings): DictionaryInfo[] {
    const dictionaryDefs = cspellSettings.dictionaryDefinitions || [];
    const dictMap = new Map<string, DictionaryInfo>(
        dictionaryDefs.map((d) => [d.name, { name: d.name, description: d.description }]),
    );

    for (const langSetting of cspellSettings.languageSettings || []) {
        const { languageId, locale, dictionaries = [] } = langSetting;
        for (const dictName of dictionaries) {
            const external = !dictMap.has(dictName);
            const dict = dictMap.get(dictName) || { name: dictName, external, description: '' };
            if (external) {
                dictMap.set(dictName, dict);
            }
            if (dict) {
                const locales = expandStringOrStringArray(locale);
                if (locales) {
                    dict.locales = dict.locales || [];
                    dict.locales.push(...locales);
                }
                const langIds = expandStringOrStringArray(languageId);
                if (langIds) {
                    dict.fileTypes = dict.fileTypes || [];
                    dict.fileTypes.push(...langIds);
                }
                const localesStr = locales?.join(', ') || '';
                const fileTypesStr = langIds?.join(', ') || '';
                if (localesStr.includes('*') && fileTypesStr.includes('*')) {
                    dict.enabled = true;
                }
                if (localesStr || fileTypesStr) {
                    dict.localeFileTypes = dict.localeFileTypes || [];
                    dict.localeFileTypes.push({
                        locale: localesStr.includes('*') ? '*' : localesStr,
                        fileType: fileTypesStr.includes('*') ? '*' : fileTypesStr,
                    });
                }
            }
        }
    }

    for (const dict of cspellSettings.dictionaries || []) {
        const d = dictMap.get(dict);
        if (d) {
            d.enabled = true;
        }
    }

    function cleanUpDict(d: DictionaryInfo): DictionaryInfo {
        d.locales = dedupe(d.locales)?.sort();
        d.fileTypes = dedupe(d.fileTypes)?.sort();
        const selectors = d.localeFileTypes?.map((lft) => `${lft.locale}/${lft.fileType}`) || [];
        const enabled = selectors.some((s) => s === '*/*');
        if (enabled) {
            d.enabled = true;
        }
        if (enabled || d.locales?.[0] === '*') {
            d.locales = undefined;
        }
        if (enabled || d.fileTypes?.[0] === '*') {
            d.fileTypes = undefined;
        }
        return d;
    }

    return [...dictMap.values()].map(cleanUpDict);
}

/**
 * Read a json file.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function readJson(pkgUrl: URL): Promise<any> {
    const text = await fs.readFile(pkgUrl, 'utf-8');
    return json5.parse(text);
}

function expandStringOrStringArray(s: string | string[] | undefined): string[] | undefined {
    return typeof s === 'string' ? s.split(',').map((l) => l.trim()) : s;
}

function dedupe<T>(a: T[] | undefined): T[] {
    if (Array.isArray(a)) return a;
    return [...new Set<T>(a)];
}

function extractImports(cspellExt: CSpellSettings): string[] {
    const imports = (typeof cspellExt.import === 'string' ? [cspellExt.import] : cspellExt.import) || [];
    const packageNames = imports.map((i) => i.replace('/cspell-ext.json', ''));
    return packageNames;
}

function extractCategories(pkgJson: Record<string, unknown>, dictionaries: DictionaryInfo[]): string[] {
    const pkgCategories = Array.isArray(pkgJson.categories) ? (pkgJson.categories as string[]) : undefined;
    return pkgCategories || extractCategoriesFromDictionaries(dictionaries);
}

function extractCategoriesFromDictionaries(dictionaries: DictionaryInfo[]): string[] {
    const categories = new Set<string>();
    for (const dict of dictionaries) {
        const programming = dict.fileTypes?.length;
        const naturalLanguage = dict.locales?.length;
        if (programming) {
            categories.add('programming');
        }
        if (naturalLanguage) {
            categories.add('natural-language');
        }
        if (!programming && !naturalLanguage) {
            categories.add('other');
        }
        if (dict.enabled) {
            categories.add('default');
        }
    }
    return [...categories];
}
