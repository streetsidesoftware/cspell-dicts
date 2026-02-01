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
 * @typedef {string} MarkdownString
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
    await fs.writeFile(new URL('install.md', pkgStaticDirUrl), toPackageInformationMarkdown(pkgInfo), 'utf8');
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
        const importPkg = useCdn
            ? new URL('cspell-ext.json', pkgNameToCdnUrl(pkgInfo.packageName, pkgInfo.version)).href
            : pkgInfo.packageName + '/cspell-ext.json';
        settings['import'] = [importPkg];
    }
    if (locales) {
        settings['language'] = locales;
    } else {
        settings['dictionaries'] = pkgInfo.dictionaries.filter((d) => !d.external).map((d) => d.name);
    }

    return settings;
}

/**
 *
 * @param {string} pkgName
 * @param {string} version
 * @returns {string}
 */
function pkgNameToCdnUrl(pkgName, version) {
    const v = version.split('.')[0] || '0';
    return `https://cdn.jsdelivr.net/npm/${pkgName}@^${v}/`;
}

/**
 *
 * @param {DictionaryPackageInfo} pkgInfo
 * @returns {MarkdownString}
 */
function toPackageInformationMarkdown(pkgInfo) {
    const pkgName = pkgInfo.packageName;

    const md = unindent`
        ## Local Installation

        ${pkgInfo.cspell ? '**This package is bundled with CSpell.**' : codeBlockInstall(pkgName)}

        ${toConfiguration(pkgInfo, false)}

        ## Local Installation using CDN

        ${toConfiguration(pkgInfo, true)}

        ${toLanguageSettingsMarkdown(pkgInfo)}

        ${toDefinedPatternsMarkdown(pkgInfo)}
    `;
    return cleanMarkdown(md);
}

/**
 *
 * @param {DictionaryPackageInfo} pkgInfo
 * @param {boolean} useCdn
 * @returns {MarkdownString}
 */
function toConfiguration(pkgInfo, useCdn) {
    if (pkgInfo.cspell && useCdn) {
        return unindent`
            > **NOTE:** This package is bundled with CSpell.
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
            'CSpell Settings <code>cspell.json</code>',
            unindent`
            **${inlineCode('cspell.json')}**

            ${codeBlock(codeJson, 'jsonc')}
        `,
        )}

        ${detailsMarkdown(
            'CSpell Settings <code>cspell.config.yaml</code>',
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
 * @returns {MarkdownString}
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
 * @returns {MarkdownString}
 */
function inlineCode(code) {
    return '`' + code + '`';
}

/**
 *
 * @param {string} title
 * @param {MarkdownString} content
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
 * @returns {MarkdownString}
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

/**
 *
 * @param {string} str
 * @returns
 */
function cleanMarkdown(str) {
    const s = str
        .replace(/(\r?\n)/g, '\n') // Normalize newlines
        .replace(/\n{3,}/g, '\n\n'); // Replace multiple newlines with two
    return removeNewlines(s) + '\n'; // Ensure a single trailing newline
}

/**
 *
 * @param {DictionaryPackageInfo} pkgInfo
 * @returns {MarkdownString}
 */
function toLanguageSettingsMarkdown(pkgInfo) {
    const dictionaries = pkgInfo.dictionaries?.map((d) => ({
        name: d.name,
        enabled: d.enabled,
        external: d.external,
        description: d.description || '',
    }));
    const distLangSettings = pkgInfo.dictionaries?.flatMap((d) =>
        (d.localeFileTypes || []).map((lft) => ({
            name: d.name,
            locale: lft.locale,
            fileType: lft.fileType,
            description: d.description || '',
        })),
    );

    const s = splitStringIntoInlineCodeBlocks;

    const dictionaryInfo = dictionaries?.length
        ? unindent`
            ## Dictionary Information

            | Name | Enabled | Description |
            | ---- | ------- | ----------- |
            ${dictionaries.map((l) => `| \`${l.name}\` | ${l.enabled ? '**Yes**' : ''} | ${l.description}${l.external ? '_External_' : ''} |`).join('\n')}

        `
        : '';

    const languageSettings = distLangSettings?.length
        ? unindent`
            ## Language Settings

            | Name | Locale | File Type |
            | ---- | ------ | --------- |
            ${distLangSettings.map((l) => `| \`${l.name}\` | ${s(l.locale)} | ${s(l.fileType)} |`).join('\n')}

        `
        : '';

    return unindent`
        ${dictionaryInfo}
        ${languageSettings}
    `;
}

/**
 *
 * @param {string} str
 * @returns {MarkdownString}
 */
function splitStringIntoInlineCodeBlocks(str) {
    return str
        .split(',')
        .map((s) => (s.trim() ? inlineCode(s.trim()) : s))
        .join(', ');
}

/**
 *
 * @param {DictionaryPackageInfo} pkgInfo
 * @returns {MarkdownString}
 */
function toDefinedPatternsMarkdown(pkgInfo) {
    if (!pkgInfo.patterns?.length) {
        return '';
    }
    const patterns = pkgInfo.patterns.map((p) => `| \`${p.name}\` | ${p.description || ''} | `).join('\n');
    return unindent`
        ## Predefined Patterns

        Predefined patterns can be used to ignore or include sequences of text to be spell checked.

        The following patterns are defined in this dictionary:

        | Name | Description |
        | ---- | ----------- |
        ${patterns}
    `;
}
