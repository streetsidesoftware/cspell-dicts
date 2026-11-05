import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import type { CSpellSettings } from '@cspell/cspell-types';
import * as md from '@streetsidesoftware/markdown-toolkit';
import { format, resolveConfig } from 'prettier';
import { Document as YamlDocument } from 'yaml';

import type { DictionaryPackageInfo } from './dictionaryInfo.mts';
import { parseInline } from './parseInline.mts';
import { readSources, sourcesCsv } from './sources-table.mts';

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

    await writeFormatted(new URL('vscode-settings.json', pkgStaticDirUrl), codeVSCode);
    await writeFormatted(new URL('example.cspell.json', pkgStaticDirUrl), codeJson);
    await writeFormatted(new URL('example.cspell.config.yaml', pkgStaticDirUrl), codeYaml);
    await writeFormatted(new URL('install.md', pkgStaticDirUrl), toPackageInformationMarkdown(pkgInfo));

    const sourcesYaml = fileURLToPath(new URL('src/sources.yaml', dirUrl));
    if (existsSync(sourcesYaml)) {
        const csv = sourcesCsv(pkgInfo.dir, readSources(sourcesYaml));
        await fs.writeFile(new URL('sources.csv', pkgStaticDirUrl), csv, 'utf8');
    }
}

async function writeFormatted(url: URL, content: string) {
    const filepath = fileURLToPath(url);
    const options = await resolveConfig(filepath, { editorconfig: true });
    await fs.writeFile(url, await format(content, { ...options, filepath }), 'utf8');
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
    return md
        .document(
            md.heading(2, 'Local Installation'),
            pkgInfo.cspell
                ? md.p(md.strong('This package is bundled with CSpell.'))
                : md.codeBlock(`npm install -D ${pkgInfo.packageName}`, 'sh'),
            toConfiguration(pkgInfo, false),
            md.heading(2, 'Local Installation using CDN'),
            toConfiguration(pkgInfo, true),
            toDictionaryInformation(pkgInfo),
            toLanguageSettings(pkgInfo),
            toDefinedPatterns(pkgInfo),
        )
        .toString();
}

function toConfiguration(pkgInfo: DictionaryPackageInfo, useCdn: boolean): md.AnyContent {
    if (pkgInfo.cspell && useCdn) {
        return md.parse('> **NOTE:** This package is bundled with CSpell.');
    }

    return [
        md.heading(2, `${useCdn ? 'CDN ' : ''}Configuration`),
        md.details(
            'VSCode Settings',
            md.p('Add the following to your VSCode settings:'),
            md.p(md.strong(md.inlineCode('.vscode/settings.json'))),
            md.codeBlock(vscodeSettingsToCdn(pkgInfo, useCdn).trimEnd(), 'jsonc'),
        ),
        md.details(
            ['CSpell Settings ', md.inlineCode('cspell.json')],
            md.p(md.strong(md.inlineCode('cspell.json'))),
            md.codeBlock(toSettingsJson(pkgInfo, useCdn).trimEnd(), 'jsonc'),
        ),
        md.details(
            ['CSpell Settings ', md.inlineCode('cspell.config.yaml')],
            md.p(md.strong(md.inlineCode('cspell.config.yaml'))),
            md.codeBlock(toSettingsYaml(pkgInfo, useCdn).trimEnd(), 'yaml'),
        ),
    ];
}

function toDictionaryInformation(pkgInfo: DictionaryPackageInfo): md.AnyContent {
    if (!pkgInfo.dictionaries?.length) return [];
    return [
        md.heading(2, 'Dictionary Information'),
        md.table(
            ['Name', 'Enabled', 'Description'],
            pkgInfo.dictionaries.map((d) => [
                md.inlineCode(d.name),
                d.enabled ? md.strong('Yes') : '',
                [parseInline(d.description || ''), d.external ? [' ', md.emphasis('External')] : ''],
            ]),
        ),
    ];
}

function toLanguageSettings(pkgInfo: DictionaryPackageInfo): md.AnyContent {
    const settings = pkgInfo.dictionaries?.flatMap((d) =>
        (d.localeFileTypes || []).map((lft) => ({ name: d.name, locale: lft.locale, fileType: lft.fileType })),
    );
    if (!settings?.length) return [];
    return [
        md.heading(2, 'Language Settings'),
        md.table(
            ['Name', 'Locale', 'File Type'],
            settings.map((l) => [md.inlineCode(l.name), inlineCodeList(l.locale), inlineCodeList(l.fileType)]),
        ),
    ];
}

function toDefinedPatterns(pkgInfo: DictionaryPackageInfo): md.AnyContent {
    if (!pkgInfo.patterns?.length) return [];
    return [
        md.heading(2, 'Predefined Patterns'),
        md.p('Predefined patterns can be used to ignore or include sequences of text to be spell checked.'),
        md.p('The following patterns are defined in this dictionary:'),
        md.table(
            ['Name', 'Description'],
            pkgInfo.patterns.map((p) => [md.inlineCode(p.name), parseInline(p.description || '')]),
        ),
    ];
}

/** A comma-separated list, such as `en, en-US`, with each entry as inline code. */
function inlineCodeList(list: string): md.InlineContent {
    return list
        .split(',')
        .map((entry) => entry.trim())
        .filter((entry) => entry)
        .map((entry, i) => (i ? [', ', md.inlineCode(entry)] : md.inlineCode(entry)));
}
