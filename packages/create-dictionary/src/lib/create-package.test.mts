import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, describe, it } from 'node:test';

import type { Settings } from './answers.mts';
import { createPackage } from './create-package.mts';
import type { Repo } from './repo.mts';
import { templateFiles } from './template.mts';
import { wordSample } from './samples.mts';
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
        hunspellDepth: 1,
        samples: [],
        ...more,
    };
}

function read(dir: string, file: string): string {
    return readFileSync(join(dir, file), 'utf8');
}

describe('createPackage', () => {
    it('copies and lists every source', async () => {
        const dir = await createPackage(
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
        // A Hunspell build can take long, so preparing it only compresses the committed build.
        assert.equal(
            JSON.parse(read(dir, 'package.json')).scripts['prepare:dictionary'],
            'cspell-tools-cli gzip "dict/several.txt"',
        );
    });

    it('writes every template, the source, and a placeholder dictionary', async () => {
        const dir = await createPackage(settings('plain', {}), repo);
        assert.equal(dir, join(repo.dictionariesDir, 'plain'));
        for (const file of templateFiles) assert.ok(existsSync(join(dir, file)), file);
        assert.equal(read(dir, 'src/words.txt'), 'zorbal\n');
        assert.ok(existsSync(join(dir, 'dict/plain.txt')));
        assert.doesNotMatch(read(dir, 'package.json'), /<%=/);
    });

    it('derives the package name and fills in the settings', async () => {
        const dir = await createPackage(settings('en_XX', { locale: 'en-XX', languageId: '*' }), repo);
        const pkg = JSON.parse(read(dir, 'package.json'));
        assert.equal(pkg.name, '@cspell/dict-en-xx');
        assert.equal(pkg.description, 'Test dictionary for cspell. -- Private until verified');
        assert.match(read(dir, 'cspell-ext.json'), /"locale": "en-XX"/);
        assert.match(read(dir, 'cspell-tools.config.yaml'), /filename: 'src\/words\.txt'/);
    });

    it('lists the contributors in package.json', async () => {
        const dir = await createPackage(
            settings('people', { contributors: ['Jane Doe (https://example.com/jane-doe)'] }),
            repo,
        );
        const pkg = JSON.parse(read(dir, 'package.json'));
        assert.deepEqual(pkg.contributors, ['Jane Doe (https://example.com/jane-doe)']);
        assert.match(read(dir, 'package.json'), /^\{\n {2}"name"/);
    });

    it("adds the extra keywords after the template's, each once", async () => {
        const dir = await createPackage(settings('kw', { keywords: ['golang', 'kw', 'spelling'] }), repo);
        const { keywords } = JSON.parse(read(dir, 'package.json'));
        assert.deepEqual(keywords.slice(-1), ['golang']);
        assert.equal(keywords.filter((k: string) => k === 'spelling').length, 1);
        assert.equal(keywords.filter((k: string) => k === 'kw').length, 1);
    });

    it('writes the word files, and lists them in the build', async () => {
        const dir = await createPackage(settings('wordfiles', {}), repo);
        assert.match(read(dir, 'src/additional_words.txt'), /^# Words to add/);
        assert.match(read(dir, 'src/exclude_words.txt'), /^# Words to leave out/);
        const config = read(dir, 'cspell-tools.config.yaml');
        assert.match(config, /filename: 'src\/additional_words\.txt'/);
        assert.match(config, /excludeWordsFrom: \['src\/exclude_words\.txt'\]/);
    });

    it('leaves the word files out when asked', async () => {
        const dir = await createPackage(settings('nowordfiles', { additionalWords: false, excludeWords: false }), repo);
        assert.ok(!existsSync(join(dir, 'src/additional_words.txt')));
        assert.ok(!existsSync(join(dir, 'src/exclude_words.txt')));
        const config = read(dir, 'cspell-tools.config.yaml');
        assert.doesNotMatch(config, /additional_words/);
        assert.match(config, /excludeWordsFrom: \[\]/);
    });

    it('starts an empty word list for a missing source', async () => {
        const dir = await createPackage(settings('empty', { sources: [wordList('nope.txt', root, true)] }), repo);
        assert.equal(read(dir, 'src/nope.txt'), '# Test Terms\n');
    });

    it('copies both Hunspell files and uses the trie format', async () => {
        const dir = await createPackage(settings('hunspell', { sources: [pairSource()], useTrie: true }), repo);
        assert.ok(existsSync(join(dir, 'src/pair/pair.dic')));
        assert.ok(existsSync(join(dir, 'src/pair/pair.aff')));
        assert.match(read(dir, 'src/sources.yaml'), /files:\n {6}- 'pair\.dic'\n {6}- 'pair\.aff'/);
        assert.ok(existsSync(join(dir, 'dict/hunspell.trie')));
        assert.match(read(dir, 'cspell-tools.config.yaml'), /format: 'trie3'/);
    });

    it('publishes the compressed build, and lets CI rebuild it when its sources change', async () => {
        const dir = await createPackage(settings('published', {}), repo);
        const pkg = JSON.parse(read(dir, 'package.json'));
        assert.equal(pkg.files[0], 'dict/published.txt.gz');
        assert.match(read(dir, 'cspell-ext.json'), /"path": "\.\/dict\/published\.txt\.gz"/);
        assert.equal(pkg.scripts['build:conditional'], 'cspell-tools-cli build --conditional');
        assert.equal(pkg.scripts['prepare:dictionary'], 'pnpm run build');
    });

    it('writes the samples, and tests with them', async () => {
        writeFileSync(join(root, 'example.rb'), 'puts zorbal\n');
        const dir = await createPackage(
            settings('samples', {
                samples: [
                    { name: 'example.rb', from: join(root, 'example.rb'), origin: 'https://example.com/ruby' },
                    { name: 'seattle.md', text: '# Seattle\n', origin: 'https://example.com/seattle' },
                ],
            }),
            repo,
        );
        assert.equal(read(dir, 'samples/example.rb'), 'puts zorbal\n');
        assert.equal(read(dir, 'samples/seattle.md'), '# Seattle\n');
        assert.match(read(dir, 'samples/README.md'), /`example\.rb`: https:\/\/example\.com\/ruby\./);
        assert.deepEqual(JSON.parse(read(dir, 'samples/cspell.json')), {
            import: ['../cspell-ext.json'],
            ignorePaths: ['README.md', 'cspell.json'],
            words: [],
            overrides: [{ filename: wordSample, language: '*', languageId: 'ruby' }],
        });
        assert.equal(read(dir, `samples/${wordSample}`), 'zorbal\n');
        assert.equal(JSON.parse(read(dir, 'package.json')).scripts.test, 'cspell samples');
        // The folder's own Markdown and text files use the dictionary; the samples are checked as users' files are.
        const [override] = JSON.parse(read(dir, 'cspell.json')).overrides;
        assert.deepEqual(override, { filename: ['**/*.{md,txt}', '!samples/**'], dictionaries: ['samples'] });
        assert.equal(JSON.parse(read(dir, 'cspell.json')).dictionaries, undefined);
    });

    it('sets the Hunspell depth on Hunspell sources only', async () => {
        const dir = await createPackage(
            settings('depth', { sources: [wordList('words.txt', root, false), pairSource()], hunspellDepth: 0 }),
            repo,
        );
        const config = read(dir, 'cspell-tools.config.yaml');
        assert.match(config, /filename: 'src\/words\.txt'\n {6}- filename: 'src\/pair\/pair\.dic'/);
        assert.match(config, /# How many affix rules[^\n]*\n[^\n]*\n {8}maxDepth: 0\n/);
        assert.equal(config.match(/maxDepth/g)?.length, 1);
    });
});
