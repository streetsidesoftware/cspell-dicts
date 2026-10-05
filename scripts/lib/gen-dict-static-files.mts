import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import type { CSpellSettings } from '@cspell/cspell-types';
import { Document as YamlDocument } from 'yaml';

import type { DictionaryPackageInfo } from './dictionaryInfo.mts';
import { readSources, sourcesCsv } from './sources-table.mts';
import { unindent } from './utils.mts';

const rootUrl = new URL('../../', import.meta.url);

type MarkdownString = string;

export async function writeStaticFilesForPackages(packages: DictionaryPackageInfo[]) {
    for (const pkgInfo of packages) {
        await writeStaticFilesForPackage(pkgInfo);
    }
}

export async function writeStaticFilesForPackage(pkgInfo: DictionaryPackageInfo) {
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

    const sourcesYaml = fileURLToPath(new URL('src/sources.yaml', dirUrl));
    if (existsSync(sourcesYaml)) {
        const csv = sourcesCsv(pkgInfo.dir, readSources(sourcesYaml));
        await fs.writeFile(new URL('sources.csv', pkgStaticDirUrl), csv, 'utf8');
    }
}

function vscodeSettingsToCdn(pkgInfo: DictionaryPackageInfo, useCdn: boolean): string {
    const vscodeSettings = Object.fromEntries(
        Object.entries(toCSpellSettings(pkgInfo, useCdn)).map(([k, v]) => ['cSpell.' + k, v]),
    );
    return JSON.stringify(vscodeSettings, null, 2) + '\n';
}

function toSettingsJson(pkgInfo: DictionaryPackageInfo, useCdn: boolean): string {
    const settings = toCSpellSettings(pkgInfo, useCdn);
    return JSON.stringify(settings, null, 2) + '\n';
}

function toSettingsYaml(pkgInfo: DictionaryPackageInfo, useCdn: boolean): string {
    const settings = toCSpellSettings(pkgInfo, useCdn);
    const doc = new YamlDocument(settings);
    return doc.toString() + '\n';
}

function toCSpellSettings(pkgInfo: DictionaryPackageInfo, useCdn: boolean): CSpellSettings {
    const settings: CSpellSettings = {};

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

function pkgNameToCdnUrl(pkgName: string, version: string): string {
    const v = version.split('.')[0] || '0';
    return `https://cdn.jsdelivr.net/npm/${pkgName}@${v}/`;
}

function toPackageInformationMarkdown(pkgInfo: DictionaryPackageInfo): MarkdownString {
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

function toConfiguration(pkgInfo: DictionaryPackageInfo, useCdn: boolean): MarkdownString {
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

function codeBlockInstall(pkgName: string): MarkdownString {
    return codeBlock(
        unindent`
            npm install -D ${pkgName}
        `,
        'sh',
    );
}

function inlineCode(code: string): MarkdownString {
    return '`' + code + '`';
}

function detailsMarkdown(title: string, content: MarkdownString) {
    return unindent`\
        <details>
        <summary>${title}</summary>

        ${removeNewlines(content)}

        </details>`;
}

function codeBlock(code: string, lang: string = ''): MarkdownString {
    return `\`\`\`${lang}\n${removeNewlines(code)}\n\`\`\``;
}

/**
 * Remove all leading and trailing newlines from a string.
 */
function removeNewlines(str: string): string {
    return removeTrailingNewlines(removeLeadingNewlines(str));
}

function removeTrailingNewlines(str: string): string {
    return str.replace(/(\r?\n)+$/, '');
}

function removeLeadingNewlines(str: string): string {
    return str.replace(/^(\r?\n)+/, '');
}

function cleanMarkdown(str: string) {
    const s = str
        .replace(/(\r?\n)/g, '\n') // Normalize newlines
        .replace(/\n{3,}/g, '\n\n'); // Replace multiple newlines with two
    return removeNewlines(s) + '\n'; // Ensure a single trailing newline
}

function toLanguageSettingsMarkdown(pkgInfo: DictionaryPackageInfo): MarkdownString {
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

function splitStringIntoInlineCodeBlocks(str: string): MarkdownString {
    return str
        .split(',')
        .map((s) => (s.trim() ? inlineCode(s.trim()) : s))
        .join(', ');
}

function toDefinedPatternsMarkdown(pkgInfo: DictionaryPackageInfo): MarkdownString {
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
