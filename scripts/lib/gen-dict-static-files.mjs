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

    const codeVSCode = vscodeSettingsToCdn(pkgInfo, true);
    const codeJson = toSettingsJson(pkgInfo, true);
    const codeYaml = toSettingsYaml(pkgInfo, true);

    await fs.writeFile(new URL('vscode-settings.json', pkgStaticDirUrl), codeVSCode, 'utf8');
    await fs.writeFile(new URL('example.cspell.json', pkgStaticDirUrl), codeJson, 'utf8');
    await fs.writeFile(new URL('example.cspell.config.yaml', pkgStaticDirUrl), codeYaml, 'utf8');
    await fs.writeFile(new URL('install.md', pkgStaticDirUrl), toInstallMarkdown(pkgInfo), 'utf8');
}

/**
 * @param {DictionaryPackageInfo} pkgInfo
 * @param {boolean} useCdn
 * @returns {string}
 */
function vscodeSettingsToCdn(pkgInfo, useCdn) {
    const vscodeSettings = Object.fromEntries(
        Object.entries(toCSpellSettings(pkgInfo, useCdn)).map(([k, v]) => ['cSpell.' + k, v]),
    );
    return JSON.stringify(vscodeSettings, null, 2) + '\n';
}

/**
 * @param {DictionaryPackageInfo} pkgInfo
 * @param {boolean} useCdn
 * @returns {string}
 */
function toSettingsJson(pkgInfo, useCdn) {
    const settings = toCSpellSettings(pkgInfo, useCdn);
    return JSON.stringify(settings, null, 2) + '\n';
}

/**
 * @param {DictionaryPackageInfo} pkgInfo
 * @param {boolean} useCdn
 * @returns {string}
 */
function toSettingsYaml(pkgInfo, useCdn) {
    const settings = toCSpellSettings(pkgInfo, useCdn);
    const doc = new YamlDocument(settings);
    return doc.toString() + '\n';
}

/**
 *
 * @param {DictionaryPackageInfo} pkgInfo
 * @param {boolean} useCdn
 * @returns {CSpellSettings}
 */
function toCSpellSettings(pkgInfo, useCdn) {
    /** @type {CSpellSettings} */
    const settings = {};

    const locales = [...new Set(pkgInfo.dictionaries.flatMap((d) => d.locales || []))].join(', ');
    if (!pkgInfo.cspell) {
        settings['import'] = [
            (useCdn ? pkgNameToCdnUrl(pkgInfo.packageName) : pkgInfo.packageName) + '/cspell-ext.json',
        ];
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
 * @returns {string}
 */
function toInstallMarkdown(pkgInfo) {
    const pkgName = pkgInfo.packageName;

    return unindent`
        ## Local Installation

        ${pkgInfo.cspell ? '**This package is bundled with CSpell.**' : codeBlockInstall(pkgName)}

        ${toConfiguration(pkgInfo, false)}

        ${toConfiguration(pkgInfo, true)}

    `;
}

/**
 *
 * @param {DictionaryPackageInfo} pkgInfo
 * @param {boolean} useCdn
 * @returns {string}
 */
function toConfiguration(pkgInfo, useCdn) {
    if (pkgInfo.cspell && useCdn) {
        return unindent`
            > Note: **This package is bundled with CSpell.**
        `;
    }

    const codeVSCode = vscodeSettingsToCdn(pkgInfo, useCdn);
    const codeJson = toSettingsJson(pkgInfo, useCdn);
    const codeYaml = toSettingsYaml(pkgInfo, useCdn);

    return unindent`
        ## ${useCdn ? 'CDN ' : ''}Configuration

        ${detailsMarkdown(
            'VSCode Settings',
            unindent`
            Add the following to your VSCode settings:

            **${inlineCode('.vscode/settings.json')}**

            ${codeBlock(codeVSCode, 'jsonc')}
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
    return unindent`\
        <details>
        <summary>${title}</summary>

        ${removeNewlines(content)}

        </details>`;
}

/**
 *
 * @param {string} code
 * @param {string} [lang]
 * @returns {string}
 */
function codeBlock(code, lang = '') {
    return `\`\`\`${lang}\n${removeNewlines(code)}\n\`\`\``;
}

/**
 * Remove all leading and trailing newlines from a string.
 * @param {string} str
 * @returns {string}
 */
function removeNewlines(str) {
    return removeTrailingNewlines(removeLeadingNewlines(str));
}

/**
 * @param {string} str
 * @returns {string}
 */
function removeTrailingNewlines(str) {
    return str.replace(/(\r?\n)+$/, '');
}

/**
 * @param {string} str
 * @returns {string}
 */
function removeLeadingNewlines(str) {
    return str.replace(/^(\r?\n)+/, '');
}
