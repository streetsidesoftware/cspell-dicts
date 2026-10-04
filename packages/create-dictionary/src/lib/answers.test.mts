import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, describe, it } from 'node:test';

import { getAnswers } from './answers.mts';
import type { Answers, CommandLine } from './options.mts';
import type { Repo } from './repo.mts';

let root = '';
let repo: Repo;

before(() => {
    root = mkdtempSync(join(tmpdir(), 'create-dictionary-answers-'));
    repo = { rootDir: root, dictionariesDir: join(root, 'dictionaries') };
    mkdirSync(repo.dictionariesDir);
    writeFileSync(join(root, 'words.txt'), 'zorbal\n');
    writeFileSync(join(root, 'pair.dic'), '1\nzorbal\n');
    writeFileSync(join(root, 'pair.aff'), 'SET UTF-8\n');
    writeFileSync(join(root, 'additional_words.txt'), 'zorbal\n');
    mkdirSync(join(root, 'sub'));
    writeFileSync(join(root, 'sub', 'words.txt'), 'quixly\n');
});

after(() => rmSync(root, { recursive: true, force: true }));

function options(answers: Answers, more: Partial<CommandLine> = {}): CommandLine {
    return {
        answers: { description: 'Test words', ...answers },
        yes: true,
        allowMissingSource: false,
        additionalWords: true,
        excludeWords: true,
        skipInstall: true,
        ...more,
    };
}

// The tests run without a terminal, so nothing here prompts.
describe('getAnswers', () => {
    it('fills in defaults with --yes', async () => {
        const settings = await getAnswers(
            options({ name: 'medical_terms', srcFiles: ['words.txt'], languageId: 'markdown' }),
            repo,
            root,
        );
        assert.deepEqual(settings, {
            name: 'medical_terms',
            friendlyName: 'Medical Terms',
            description: 'Test words',
            packageDescription: 'Medical Terms dictionary for cspell.',
            contributors: [],
            keywords: [],
            additionalWords: true,
            excludeWords: true,
            sources: [{ file: 'words.txt', empty: false }],
            locale: '*',
            languageId: 'markdown',
            useTrie: false,
            doBuild: false,
        });
    });

    it('defaults to a trie and a build for a Hunspell source', async () => {
        const settings = await getAnswers(options({ name: 'xx', srcFiles: ['pair.dic'], locale: 'xx' }), repo, root);
        assert.equal(settings.useTrie, true);
        assert.equal(settings.doBuild, true);
    });

    it('keeps given values over defaults', async () => {
        const settings = await getAnswers(
            options({ name: 'ruby', srcFiles: ['pair.dic'], languageId: 'ruby', useTrie: false, doBuild: false }),
            repo,
            root,
        );
        assert.equal(settings.useTrie, false);
        assert.equal(settings.doBuild, false);
    });

    it('starts an empty src/<name>.txt with only --allow-missing-source', async () => {
        const settings = await getAnswers(
            options({ name: 'ruby', languageId: 'ruby' }, { allowMissingSource: true }),
            repo,
            root,
        );
        assert.deepEqual(settings.sources, [{ file: 'ruby.txt', empty: true }]);
    });

    it('marks a missing source as empty with --allow-missing-source', async () => {
        const settings = await getAnswers(
            options({ name: 'ruby', srcFiles: ['nope.txt'], languageId: 'ruby' }, { allowMissingSource: true }),
            repo,
            root,
        );
        assert.deepEqual(settings.sources, [{ file: 'nope.txt', empty: true }]);
    });

    it('combines several sources, mixing word lists and Hunspell files', async () => {
        const settings = await getAnswers(
            options({ name: 'mixed', srcFiles: ['words.txt', 'pair.aff'], locale: 'xx' }),
            repo,
            root,
        );
        assert.deepEqual(settings.sources, [
            { file: 'words.txt', empty: false },
            { file: 'pair.dic', empty: false },
        ]);
        assert.equal(settings.useTrie, true);
    });

    it('counts both files of a Hunspell pair as one source', async () => {
        const settings = await getAnswers(
            options({ name: 'pair', srcFiles: ['pair.dic', 'pair.aff'], locale: 'xx' }),
            repo,
            root,
        );
        assert.deepEqual(settings.sources, [{ file: 'pair.dic', empty: false }]);
    });

    it('refuses two sources copied to the same file', async () => {
        await assert.rejects(
            getAnswers(
                options({ name: 'clash', srcFiles: ['words.txt', 'sub/words.txt'], languageId: 'ruby' }),
                repo,
                root,
            ),
            /would both be copied to src\/words\.txt/,
        );
    });

    it('fails on a missing source without --allow-missing-source', async () => {
        await assert.rejects(
            getAnswers(options({ name: 'ruby', srcFiles: ['nope.txt'], languageId: 'ruby' }), repo, root),
            /nope\.txt not found/,
        );
    });

    it('fails without a source with --yes', async () => {
        await assert.rejects(getAnswers(options({ name: 'ruby', languageId: 'ruby' }), repo, root), /missing source/);
    });

    it('requires a description with --yes', async () => {
        await assert.rejects(
            getAnswers(
                options({ name: 'ruby', description: undefined, srcFiles: ['words.txt'], languageId: 'ruby' }),
                repo,
                root,
            ),
            /--description: missing/,
        );
    });

    it('keeps the given contributors, trimmed', async () => {
        const settings = await getAnswers(
            options({
                name: 'ruby',
                contributors: [' Jane Doe (https://example.com/jane-doe) ', 'John Roe <john@example.com>'],
                srcFiles: ['words.txt'],
                languageId: 'ruby',
            }),
            repo,
            root,
        );
        assert.deepEqual(settings.contributors, [
            'Jane Doe (https://example.com/jane-doe)',
            'John Roe <john@example.com>',
        ]);
    });

    it("refuses a contributor that is not in npm's form", async () => {
        await assert.rejects(
            getAnswers(
                options({
                    name: 'ruby',
                    contributors: ['<john@example.com>'],
                    srcFiles: ['words.txt'],
                    languageId: 'ruby',
                }),
                repo,
                root,
            ),
            /--contributor: "<john@example\.com>" isn't "Name"/,
        );
    });

    it('keeps the given keywords, trimmed', async () => {
        const settings = await getAnswers(
            options({ name: 'golang', keywords: [' go ', 'golang'], srcFiles: ['words.txt'], languageId: 'go' }),
            repo,
            root,
        );
        assert.deepEqual(settings.keywords, ['go', 'golang']);
    });

    it('refuses several keywords in one --keyword', async () => {
        await assert.rejects(
            getAnswers(
                options({ name: 'golang', keywords: ['go,golang'], srcFiles: ['words.txt'], languageId: 'go' }),
                repo,
                root,
            ),
            /--keyword: "go,golang" has a comma/,
        );
    });

    it('refuses a source named like a file it writes in src/', async () => {
        await assert.rejects(
            getAnswers(options({ name: 'clash', srcFiles: ['additional_words.txt'], languageId: 'ruby' }), repo, root),
            /would both be copied to src\/additional_words\.txt/,
        );
    });

    it('keeps a given npm description', async () => {
        const settings = await getAnswers(
            options({ name: 'ruby', packageDescription: 'Ruby words.', srcFiles: ['words.txt'], languageId: 'ruby' }),
            repo,
            root,
        );
        assert.equal(settings.packageDescription, 'Ruby words.');
    });

    it('fails when the locale and the file type are both "*"', async () => {
        await assert.rejects(getAnswers(options({ name: 'ruby', srcFiles: ['words.txt'] }), repo, root), /every file/);
    });

    it('prefixes an invalid value with its option', async () => {
        await assert.rejects(
            getAnswers(options({ name: 'a.b', srcFiles: ['words.txt'], languageId: 'ruby' }), repo, root),
            /<name> or --name: "a\.b" can only have letters/,
        );
    });

    it('fails without --yes when answers are missing and there is no terminal', async () => {
        await assert.rejects(
            getAnswers(options({ name: 'ruby' }, { yes: false }), repo, root),
            /No terminal to prompt in\. Give --yes, or all of: --friendly-name/,
        );
    });
});
