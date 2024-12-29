// ts-check
import fs from 'node:fs/promises';
import path from 'node:path/posix';

import bundledWithCSpell from '@cspell/cspell-bundled-dicts';
import json5 from 'json5';

const rootUrl = new URL('../../', import.meta.url);

/**
 * Dictionary information.
 * @typedef {object} DictionaryInfo
 * @property {string} name The name of the dictionary.
 * @property {string} [description] The description of the dictionary.
 * @property {string[]} [locales] The locales supported by the dictionary.
 * @property {string[]} [fileTypes] The dictionary is enabled for the following file types.
 * @property {boolean} [enabled] The dictionary is enabled by default.
 */

/**
 * Dictionary Package information.
 * @typedef {object} DictionaryPackageInfo
 * @property {string} name The name of the dictionary.
 * @property {string} packageName The name of the package.
 * @property {string} dir The directory containing the dictionary package.
 * @property {boolean} bundled The dictionary package is bundled with cspell.
 * @property {string} description The description of the package.
 * @property {string[]} categories The category of the package. (e.g. programming, natural-language)
 * @property {DictionaryInfo[]} dictionaries The dictionaries in the package.
 */

/**
 * @typedef {import('@cspell/cspell-types').CSpellSettings} CSpellSettings
 */

/** @type {CSpellSettings} */
const cspellBundle = bundledWithCSpell;

const defaultCSpellImports = new Set(extractImports(cspellBundle));

/**
 *
 * @param {URL} dictURL
 * @returns {Promise<DictionaryPackageInfo>}
 */
export async function fetchDictionaryInfo(dictURL) {
    dictURL = new URL('./', dictURL);
    const pkgUrl = new URL('package.json', dictURL);

    const pkgJson = await readJson(pkgUrl);
    const extFile = pkgJson.exports?.['.'] || 'cspell-ext.json';
    const cspellExtUrl = new URL(extFile, dictURL);
    /** @type {CSpellSettings} */
    const cspellExt = await readJson(cspellExtUrl);
    const dictionaries = extractDictionaryInfo(cspellExt);
    return {
        name: cspellExt.name || pkgJson.name,
        dir: path.relative(rootUrl.pathname, dictURL.pathname),
        packageName: pkgJson.name,
        description: cspellExt.description || pkgJson.description || '',
        bundled: defaultCSpellImports.has(pkgJson.name),
        categories: extractCategories(pkgJson, cspellExt),
        dictionaries,
    };
}

/**
 *
 * @param {CSpellSettings} cspellExt
 * @returns {DictionaryInfo[]}
 */
export function extractDictionaryInfo(cspellExt) {
    const dictionaryDefs = cspellExt.dictionaryDefinitions || [];
    /** @type {Map<string, DictionaryInfo>} */
    const dictMap = new Map(dictionaryDefs.map((d) => [d.name, { name: d.name, description: d.description }]));

    for (const langSetting of cspellExt.languageSettings || []) {
        const { languageId, locale, dictionaries = [] } = langSetting;
        for (const dictName of dictionaries) {
            const dict = dictMap.get(dictName);
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
            }
        }
    }

    for (const dict of cspellExt.dictionaries || []) {
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
        if (d.locales?.includes('*') && d.fileTypes?.includes('*')) {
            d.enabled = true;
        }
        if (!d.locales?.length || d.locales[0] === '*') {
            d.locales = undefined;
        }
        if (!d.fileTypes?.length || d.fileTypes[0] === '*') {
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
 * @param {CSpellSettings} cspellExt
 * @returns {string[]}
 */
function extractCategories(pkgJson, cspellExt) {
    const pkgCategories = Array.isArray(pkgJson.categories) ? pkgJson.categories : undefined;
    return pkgCategories || extractCategoriesFromDictionaries(extractDictionaryInfo(cspellExt));
}

/**
 *
 * @param {DictionaryInfo} dictionaries
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
