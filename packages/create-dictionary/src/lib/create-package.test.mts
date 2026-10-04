import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, describe, it } from 'node:test';

import type { Settings } from './answers.mts';
import { createPackage } from './create-package.mts';
import type { Repo } from './repo.mts';
import { templateFiles } from './template.mts';

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

function settings(name: string, more: Partial<Settings>): Settings {
    return {
        name,
        friendlyName: 'Test',
        description: 'Test words',
        packageDescription: 'Test dictionary for cspell.',
        sources: [{ file: 'words.txt', empty: false }],
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
                sources: [
                    { file: 'words.txt', empty: false },
                    { file: 'pair.dic', empty: false },
                    { file: 'extra.txt', empty: true },
                ],
            }),
            repo,
            root,
        );
        for (const file of ['src/words.txt', 'src/pair.dic', 'src/pair.aff', 'src/extra.txt']) {
            assert.ok(existsSync(join(dir, file)), file);
        }
        const config = read(dir, 'cspell-tools.config.yaml');
        for (const file of ['words.txt', 'pair.dic', 'extra.txt']) {
            assert.match(config, new RegExp(`filename: 'src/${file.replace('.', '\\.')}'`));
        }
        assert.match(read(dir, 'package.json'), /"prepare:dictionary": "echo OK"/);
    });

    it('writes every template, the source, and a placeholder dictionary', () => {
        const dir = createPackage(settings('plain', {}), repo, root);
        assert.equal(dir, join(repo.dictionariesDir, 'plain'));
        for (const file of templateFiles) assert.ok(existsSync(join(dir, file)), file);
        assert.equal(read(dir, 'src/words.txt'), 'zorbal\n');
        assert.ok(existsSync(join(dir, 'dict/plain.txt')));
        assert.doesNotMatch(read(dir, 'package.json'), /<%=/);
    });

    it('derives the package name and fills in the settings', () => {
        const dir = createPackage(settings('en_XX', { locale: 'en-XX', languageId: '*' }), repo, root);
        const pkg = JSON.parse(read(dir, 'package.json'));
        assert.equal(pkg.name, '@cspell/dict-en-xx');
        assert.equal(pkg.description, 'Test dictionary for cspell. -- Private until verified');
        assert.match(read(dir, 'cspell-ext.json'), /"locale": "en-XX"/);
        assert.match(read(dir, 'cspell-tools.config.yaml'), /filename: 'src\/words\.txt'/);
    });

    it('starts an empty word list for a missing source', () => {
        const dir = createPackage(settings('empty', { sources: [{ file: 'nope.txt', empty: true }] }), repo, root);
        assert.equal(read(dir, 'src/nope.txt'), '# Test Terms\n');
    });

    it('copies both Hunspell files and uses the trie format', () => {
        const dir = createPackage(
            settings('hunspell', { sources: [{ file: 'pair.dic', empty: false }], useTrie: true }),
            repo,
            root,
        );
        assert.ok(existsSync(join(dir, 'src/pair.dic')));
        assert.ok(existsSync(join(dir, 'src/pair.aff')));
        assert.ok(existsSync(join(dir, 'dict/hunspell.trie')));
        assert.match(read(dir, 'cspell-tools.config.yaml'), /format: 'trie3'/);
        assert.match(read(dir, 'package.json'), /hunspell-reader words/);
    });
});
