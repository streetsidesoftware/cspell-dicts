// ts-check
import fs from 'node:fs/promises';
import path from 'node:path/posix';

import bundledWithCSpell from '@cspell/cspell-bundled-dicts';
import { readConfigFile, resolveConfigFileImports } from 'cspell-lib';
import json5 from 'json5';

const rootUrl = new URL('../../', import.meta.url);

/**
 * @typedef {Awaited<ReturnType<import('cspell-lib').readConfigFile>>} CSpellConfigFile
 * @typedef {import('@cspell/cspell-types').RegExpPatternDefinition} PatternDefinition
 * @typedef {import('@cspell/cspell-types').CSpellSettings} CSpellSettings
 */

/**
 * Locale/FileType Pair.
 * @typedef {object} LocaleFileTypePair
 * @property {string} locale The locale of the dictionary.
 * @property {string} fileType The file type of the dictionary.
 */

/**
 * Dictionary information.
 * @typedef {object} DictionaryInfo
 * @property {string} name The name of the dictionary.
 * @property {string} [description] The description of the dictionary.
 * @property {string[]} [locales] The locales supported by the dictionary.
 * @property {string[]} [fileTypes] The dictionary is enabled for the following file types.
 * @property {LocaleFileTypePair[]} [localeFileTypes] The dictionary is enabled for the following locale/file type pairs.
 * @property {boolean} [enabled] The dictionary is enabled by default.
 * @property {boolean} [external] The dictionary is defined in an external package.
 */

/**
 * Dictionary Package information.
 * @typedef {object} DictionaryPackageInfo
 * @property {string} name The name of the dictionary.
 * @property {string} version The version of the package.
 * @property {string} packageName The name of the package.
 * @property {string} dir The directory containing the dictionary package.
 * @property {boolean} cspell The dictionary package is bundled with cspell.
 * @property {string} description The description of the package.
 * @property {string[]} categories The category of the package. (e.g. programming, natural-language)
 * @property {DictionaryInfo[]} dictionaries The dictionaries in the package.
 * @property {boolean} [isBundle] The dictionary package is a bundle of other packages.
 * @property {boolean} [hasEnabledByDefault] The dictionary package has dictionaries enabled by default.
 * @property {PatternDefinition[]} [patterns] The patterns defined by the dictionary.
 */

/** @type {CSpellSettings} */
const cspellBundle = bundledWithCSpell;

const defaultCSpellImports = new Set(extractImports(cspellBundle));

/**
 *
 * @param {URL} dictURL
 * @returns {Promise<DictionaryPackageInfo | undefined>}
 */
export async function fetchDictionaryInfo(dictURL) {
    dictURL = new URL('./', dictURL);
    const pkgUrl = new URL('package.json', dictURL);

    const pkgJson = await readJson(pkgUrl);
    const extFile = pkgJson.exports?.['.'] || 'cspell-ext.json';
    const cspellExtUrl = new URL(extFile, dictURL);
    const extConfigFile = await readConfigFileOrUndefined(cspellExtUrl);
    if (!extConfigFile) {
        return undefined;
    }
    /** @type {CSpellSettings} */
    const cspellExt = extConfigFile.settings;
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

async function readConfigFileOrUndefined(cspellExtUrl) {
    try {
        return await readConfigFile(cspellExtUrl);
    } catch (e) {
        if (e.code === 'ENOENT' || e.cause?.code === 'ENOENT') {
            return undefined;
        }
        console.error(`Error reading config file: ${cspellExtUrl} - ${e.message} %o`, e);
        throw e;
    }
}

/**
 * @param {CSpellSettings} cspellSettings
 * @returns {DictionaryInfo[]}
 */
export function extractDictionaryInfo(cspellSettings) {
    const dictionaryDefs = cspellSettings.dictionaryDefinitions || [];
    /** @type {Map<string, DictionaryInfo>} */
    const dictMap = new Map(dictionaryDefs.map((d) => [d.name, { name: d.name, description: d.description }]));

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

    /**
     *
     * @param {DictionaryInfo} d
     * @returns {DictionaryInfo}
     */
    function cleanUpDict(d) {
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
 * @param {URL} pkgUrl
 * @returns {Promise<any>}
 */
async function readJson(pkgUrl) {
    const text = await fs.readFile(pkgUrl, 'utf-8');
    return json5.parse(text);
}

/**
 *
 * @param {string | string[] | undefined} s
 * @returns {string[] | undefined}
 */
function expandStringOrStringArray(s) {
    return typeof s === 'string' ? s.split(',').map((l) => l.trim()) : s;
}

function dedupe(a) {
    if (Array.isArray(a)) return a;
    return [...new Set(a)];
}

/**
 *
 * @param {CSpellSettings} cspellExt
 * @returns {string[]}
 */
function extractImports(cspellExt) {
    const imports = (typeof cspellExt.import === 'string' ? [cspellExt.import] : cspellExt.import) || [];
    const packageNames = imports.map((i) => i.replace('/cspell-ext.json', ''));
    return packageNames;
}

/**
 * @param {Record<string, any>} pkgJson
 * @param {DictionaryInfo[]} dictionaries
 * @returns {string[]}
 */
function extractCategories(pkgJson, dictionaries) {
    const pkgCategories = Array.isArray(pkgJson.categories) ? pkgJson.categories : undefined;
    return pkgCategories || extractCategoriesFromDictionaries(dictionaries);
}

/**
 *
 * @param {DictionaryInfo[]} dictionaries
 * @returns {string[]}
 */
function extractCategoriesFromDictionaries(dictionaries) {
    const categories = new Set();
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
