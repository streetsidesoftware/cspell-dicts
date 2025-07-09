// @ts-check

import fs from 'node:fs/promises';
import { Document as YamlDocument } from 'yaml';

import { unindent } from './utils.mjs';

const rootUrl = new URL('../../', import.meta.url);

/**
 * @typedef {import('./dictionaryInfo.mjs').DictionaryPackageInfo} DictionaryPackageInfo
 * @typedef {import('@cspell/cspell-types').CSpellSettings} CSpellSettings
 */

/**
 *
 * @param {DictionaryPackageInfo[]} packages
 */
export async function writeStaticFilesForPackages(packages) {
    for (const pkgInfo of packages) {
        await writeStaticFilesForPackage(pkgInfo);
    }
}

/**
 *
 * @param {DictionaryPackageInfo} pkgInfo
 */
export async function writeStaticFilesForPackage(pkgInfo) {
    const dir = (pkgInfo.dir + '/').replaceAll('//', '/');
    const dirUrl = new URL(dir, rootUrl);
    // const pkgUrl = new URL('package.json', dirUrl);
    const pkgStaticDirUrl = new URL('static/', dirUrl);
    // const pkgName = pkgInfo.packageName;
    // const cspellExtFile = new URL('cspell-ext.json', pkgUrl);
    // const cspellExtContent = JSON.stringify(pkgInfo, null, 2);

    await fs.mkdir(pkgStaticDirUrl, { recursive: true });

    const codeVSCode = vscodeSettingsToCdn(pkgInfo);
    const codeJson = settingsJsonToCdn(pkgInfo);
    const codeYaml = settingsYamlToCdn(pkgInfo);

    await fs.writeFile(new URL('vscode-settings.json', pkgStaticDirUrl), codeVSCode, 'utf8');
    await fs.writeFile(new URL('example.cspell.json', pkgStaticDirUrl), codeJson, 'utf8');
    await fs.writeFile(new URL('example.cspell.config.yaml', pkgStaticDirUrl), codeYaml, 'utf8');
    await fs.writeFile(
        new URL('install.md', pkgStaticDirUrl),
        toInstallMarkdown(pkgInfo, codeVSCode, codeJson, codeYaml),
        'utf8',
    );
}

/**
 * @param {DictionaryPackageInfo} pkgInfo
 * @returns {string}
 */
function vscodeSettingsToCdn(pkgInfo) {
    const vscodeSettings = Object.fromEntries(
        Object.entries(toCSpellSettings(pkgInfo)).map(([k, v]) => ['cSpell.' + k, v]),
    );
    return JSON.stringify(vscodeSettings, null, 2) + '\n';
}

/**
 * @param {DictionaryPackageInfo} pkgInfo
 * @returns {string}
 */
function settingsJsonToCdn(pkgInfo) {
    const settings = toCSpellSettings(pkgInfo);
    return JSON.stringify(settings, null, 2) + '\n';
}

/**
 * @param {DictionaryPackageInfo} pkgInfo
 * @returns {string}
 */
function settingsYamlToCdn(pkgInfo) {
    const settings = toCSpellSettings(pkgInfo);
    const doc = new YamlDocument(settings);
    return doc.toString() + '\n';
}

/**
 *
 * @param {DictionaryPackageInfo} pkgInfo
 * @returns {CSpellSettings}
 */
function toCSpellSettings(pkgInfo) {
    /** @type {CSpellSettings} */
    const settings = {};

    const locales = [...new Set(pkgInfo.dictionaries.flatMap((d) => d.locales || []))].join(', ');
    if (!pkgInfo.cspell) {
        settings['import'] = [pkgNameToCdnUrl(pkgInfo.packageName)];
    }
    if (locales) {
        settings['language'] = locales;
    } else {
        settings['dictionaries'] = pkgInfo.dictionaries.map((d) => d.name);
    }

    return settings;
}

/**
 *
 * @param {string} pkgName
 * @returns
 */
function pkgNameToCdnUrl(pkgName) {
    return `https://cdn.jsdelivr.net/npm/${pkgName}@latest/cspell-ext.json`;
}

/**
 *
 * @param {DictionaryPackageInfo} pkgInfo
 * @param {string} codeVScode
 * @param {string} codeJson
 * @param {string} codeYaml
 * @returns {string}
 */
function toInstallMarkdown(pkgInfo, codeVScode, codeJson, codeYaml) {
    const pkgName = pkgInfo.packageName;

    return unindent`
        ## Installation

        ${pkgInfo.cspell ? '**This package is bundled with CSpell.**' : codeBlockInstall(pkgName)}

        ## Configuration

        ${detailsMarkdown(
            'VSCode Settings',
            unindent`
            Add the following to your VSCode settings:

            **${inlineCode('.vscode/settings.json')}**

            ${codeBlock(codeVScode, 'jsonc')}
        `,
        )}

        ${detailsMarkdown(
            'CSpell Settings `cspell.json`',
            unindent`
            **${inlineCode('cspell.json')}**

            ${codeBlock(codeJson, 'jsonc')}
        `,
        )}

        ${detailsMarkdown(
            'CSpell Settings `cspell.config.yaml`',
            unindent`
            **${inlineCode('cspell.config.yaml')}**

            ${codeBlock(codeYaml, 'yaml')}
        `,
        )}
    `;
}

/**
 *
 * @param {string} pkgName
 * @returns {string}
 */
function codeBlockInstall(pkgName) {
    return codeBlock(
        unindent`
            npm install -D ${pkgName}
        `,
        'sh',
    );
}

/**
 *
 * @param {string} code
 * @returns {string}
 */
function inlineCode(code) {
    return '`' + code + '`';
}

/**
 *
 * @param {string} title
 * @param {string} content
 */
function detailsMarkdown(title, content) {
    return unindent`
        <details>
        <summary>${title}</summary>

        ${content}

        </details>
    `;
}

/**
 *
 * @param {string} code
 * @param {string} [lang]
 * @returns {string}
 */
function codeBlock(code, lang = '') {
    return `\`\`\`${lang}\n${code.replace(/^(\r?\n)+/, '').replace(/\r?\n$/, '')}\n\`\`\``;
}
