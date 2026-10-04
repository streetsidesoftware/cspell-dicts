import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, describe, it } from 'node:test';

import type { Settings } from './answers.mts';
import { createPackage } from './create-package.mts';
import type { Repo } from './repo.mts';
import { templateFiles } from './template.mts';
import { type Source, wordList } from './sources.mts';

let root = '';
let repo: Repo;

before(() => {
    root = mkdtempSync(join(tmpdir(), 'create-dictionary-package-'));
    repo = { rootDir: root, dictionariesDir: join(root, 'dictionaries') };
    mkdirSync(repo.dictionariesDir);
    writeFileSync(join(root, 'words.txt'), 'zorbal\n');
    writeFileSync(join(root, 'pair.dic'), '1\nzorbal\n');
    writeFileSync(join(root, 'pair.aff'), 'SET UTF-8\n');
});

after(() => rmSync(root, { recursive: true, force: true }));

/** The Hunspell pair in the test's folder, as a named source. */
function pairSource(): Source {
    return {
        name: 'pair',
        root,
        files: [
            { path: 'pair.dic', local: 'pair.dic' },
            { path: 'pair.aff', local: 'pair.aff' },
        ],
    };
}

function settings(name: string, more: Partial<Settings>): Settings {
    return {
        name,
        friendlyName: 'Test',
        description: 'Test words',
        packageDescription: 'Test dictionary for cspell.',
        contributors: [],
        keywords: [],
        additionalWords: true,
        excludeWords: true,
        sources: [wordList('words.txt', root, false)],
        locale: '*',
        languageId: 'ruby',
        useTrie: false,
        doBuild: false,
        ...more,
    };
}

function read(dir: string, file: string): string {
    return readFileSync(join(dir, file), 'utf8');
}

describe('createPackage', () => {
    it('copies and lists every source', () => {
        const dir = createPackage(
            settings('several', {
                sources: [wordList('words.txt', root, false), wordList('extra.txt', root, true), pairSource()],
            }),
            repo,
        );
        for (const file of ['src/words.txt', 'src/pair/pair.dic', 'src/pair/pair.aff', 'src/extra.txt']) {
            assert.ok(existsSync(join(dir, file)), file);
        }
        const config = read(dir, 'cspell-tools.config.yaml');
        for (const file of ['words.txt', 'pair/pair.dic', 'extra.txt']) {
            assert.match(config, new RegExp(`filename: 'src/${file.replace('.', '\\.')}'`));
        }
        assert.match(read(dir, 'package.json'), /"prepare:dictionary": "echo OK"/);
    });

    it('writes every template, the source, and a placeholder dictionary', () => {
        const dir = createPackage(settings('plain', {}), repo);
        assert.equal(dir, join(repo.dictionariesDir, 'plain'));
        for (const file of templateFiles) assert.ok(existsSync(join(dir, file)), file);
        assert.equal(read(dir, 'src/words.txt'), 'zorbal\n');
        assert.ok(existsSync(join(dir, 'dict/plain.txt')));
        assert.doesNotMatch(read(dir, 'package.json'), /<%=/);
    });

    it('derives the package name and fills in the settings', () => {
        const dir = createPackage(settings('en_XX', { locale: 'en-XX', languageId: '*' }), repo);
        const pkg = JSON.parse(read(dir, 'package.json'));
        assert.equal(pkg.name, '@cspell/dict-en-xx');
        assert.equal(pkg.description, 'Test dictionary for cspell. -- Private until verified');
        assert.match(read(dir, 'cspell-ext.json'), /"locale": "en-XX"/);
        assert.match(read(dir, 'cspell-tools.config.yaml'), /filename: 'src\/words\.txt'/);
    });

    it('lists the contributors in package.json', () => {
        const dir = createPackage(
            settings('people', { contributors: ['Jane Doe (https://example.com/jane-doe)'] }),
            repo,
        );
        const pkg = JSON.parse(read(dir, 'package.json'));
        assert.deepEqual(pkg.contributors, ['Jane Doe (https://example.com/jane-doe)']);
        assert.match(read(dir, 'package.json'), /^\{\n {2}"name"/);
    });

    it("adds the extra keywords after the template's, each once", () => {
        const dir = createPackage(settings('kw', { keywords: ['golang', 'kw', 'spelling'] }), repo);
        const { keywords } = JSON.parse(read(dir, 'package.json'));
        assert.deepEqual(keywords.slice(-1), ['golang']);
        assert.equal(keywords.filter((k: string) => k === 'spelling').length, 1);
        assert.equal(keywords.filter((k: string) => k === 'kw').length, 1);
    });

    it('writes the word files, and lists them in the build', () => {
        const dir = createPackage(settings('wordfiles', {}), repo);
        assert.match(read(dir, 'src/additional_words.txt'), /^# Words to add/);
        assert.match(read(dir, 'src/exclude_words.txt'), /^# Words to leave out/);
        const config = read(dir, 'cspell-tools.config.yaml');
        assert.match(config, /filename: 'src\/additional_words\.txt'/);
        assert.match(config, /excludeWordsFrom: \['src\/exclude_words\.txt'\]/);
    });

    it('leaves the word files out when asked', () => {
        const dir = createPackage(settings('nowordfiles', { additionalWords: false, excludeWords: false }), repo);
        assert.ok(!existsSync(join(dir, 'src/additional_words.txt')));
        assert.ok(!existsSync(join(dir, 'src/exclude_words.txt')));
        const config = read(dir, 'cspell-tools.config.yaml');
        assert.doesNotMatch(config, /additional_words/);
        assert.match(config, /excludeWordsFrom: \[\]/);
    });

    it('starts an empty word list for a missing source', () => {
        const dir = createPackage(settings('empty', { sources: [wordList('nope.txt', root, true)] }), repo);
        assert.equal(read(dir, 'src/nope.txt'), '# Test Terms\n');
    });

    it('copies both Hunspell files and uses the trie format', () => {
        const dir = createPackage(settings('hunspell', { sources: [pairSource()], useTrie: true }), repo);
        assert.ok(existsSync(join(dir, 'src/pair/pair.dic')));
        assert.ok(existsSync(join(dir, 'src/pair/pair.aff')));
        assert.match(read(dir, 'src/sources.yaml'), /files:\n {6}- 'pair\.dic'\n {6}- 'pair\.aff'/);
        assert.ok(existsSync(join(dir, 'dict/hunspell.trie')));
        assert.match(read(dir, 'cspell-tools.config.yaml'), /format: 'trie3'/);
        assert.match(read(dir, 'package.json'), /hunspell-reader words/);
    });
});
