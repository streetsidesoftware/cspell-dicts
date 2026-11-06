import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, describe, it } from 'node:test';

import { getAnswers } from './answers.mts';
import type { Answers, CommandLine } from './options.mts';
import type { Repo } from './repo.mts';
import { noSampleOptions } from './samples.mts';
import { noSourceOptions, wordList } from './sources.mts';

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
    writeFileSync(join(root, 'big.txt'), 'zorbal\n'.repeat(150_000));
    mkdirSync(join(root, 'sub'));
    writeFileSync(join(root, 'sub', 'words.txt'), 'quixly\n');
    writeFileSync(join(root, 'sub', 'other.dic'), '1\nquixly\n');
    writeFileSync(join(root, 'sub', 'other.aff'), 'SET UTF-8\n');
    writeFileSync(join(root, 'sub', 'pair.dic'), '1\nquixly\n');
    writeFileSync(join(root, 'sub', 'pair.aff'), 'SET UTF-8\n');
});

after(() => rmSync(root, { recursive: true, force: true }));

function options(answers: Answers, more: Partial<CommandLine> = {}): CommandLine {
    return {
        answers: { description: 'Test words', ...answers },
        yes: true,
        placeholderWordLists: false,
        sourceOptions: noSourceOptions,
        sampleOptions: noSampleOptions,
        wikipediaSample: false,
        hunspellDepth: 1,
        additionalWords: true,
        excludeWords: true,
        enableForAllFiles: false,
        languageSettings: true,
        skipInstall: true,
        ...more,
    };
}

// The tests run without a terminal, so nothing here prompts.
describe('getAnswers', () => {
    it('fills in defaults with --yes', async () => {
        const settings = await getAnswers(
            options({ name: 'medical-terms', srcFiles: ['words.txt'], languageId: 'markdown' }),
            repo,
            root,
        );
        assert.deepEqual(settings, {
            name: 'medical-terms',
            friendlyName: 'Medical Terms',
            description: 'Test words',
            packageDescription: 'Medical Terms dictionary for cspell.',
            contributors: [],
            keywords: [],
            additionalWords: true,
            excludeWords: true,
            sources: [wordList('words.txt', root, false)],
            samples: [],
            hunspellDepth: 1,
            enableForAllFiles: false,
            languageSettings: true,
            locale: '*',
            languageId: 'markdown',
            useTrie: false,
            doBuild: true,
        });
    });

    it('defaults to a trie, and no build, for a Hunspell source', async () => {
        const settings = await getAnswers(options({ name: 'xx', srcFiles: ['pair.dic'], locale: 'xx' }), repo, root);
        assert.equal(settings.useTrie, true);
        assert.equal(settings.doBuild, false);
    });

    it('defaults to a trie for word lists over 1 MB', async () => {
        const settings = await getAnswers(
            options({ name: 'big', srcFiles: ['big.txt'], languageId: 'ruby' }),
            repo,
            root,
        );
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

    it('starts an empty src/<name>.txt with only --placeholder-word-lists', async () => {
        const settings = await getAnswers(
            options({ name: 'ruby', languageId: 'ruby' }, { placeholderWordLists: true }),
            repo,
            root,
        );
        assert.deepEqual(settings.sources, [wordList('ruby.txt', root, true)]);
    });

    it('marks a missing source as empty with --placeholder-word-lists', async () => {
        const settings = await getAnswers(
            options({ name: 'ruby', srcFiles: ['nope.txt'], languageId: 'ruby' }, { placeholderWordLists: true }),
            repo,
            root,
        );
        assert.deepEqual(settings.sources, [wordList('nope.txt', root, true)]);
    });

    it('combines several sources, mixing word lists and Hunspell files', async () => {
        const settings = await getAnswers(
            options({ name: 'mixed', srcFiles: ['words.txt', 'pair.aff'], locale: 'xx' }),
            repo,
            root,
        );
        assert.deepEqual(
            settings.sources.map((s) => [s.name, s.files.map((f) => f.local)]),
            [
                [undefined, ['words.txt']],
                ['hunspell', ['pair.dic', 'pair.aff']],
            ],
        );
        assert.equal(settings.useTrie, true);
    });

    it('counts both files of a Hunspell pair as one source', async () => {
        const settings = await getAnswers(
            options({ name: 'pair', srcFiles: ['pair.dic', 'pair.aff'], locale: 'xx' }),
            repo,
            root,
        );
        assert.deepEqual(
            settings.sources.map((s) => [s.name, s.files.map((f) => f.local)]),
            [['hunspell', ['pair.dic', 'pair.aff']]],
        );
    });

    it('puts every Hunspell file given on its own in the one source hunspell', async () => {
        const settings = await getAnswers(
            options({ name: 'two', srcFiles: ['pair.dic', 'sub/other.aff'], locale: 'xx' }),
            repo,
            root,
        );
        assert.deepEqual(
            settings.sources.map((s) => [s.name, s.files.map((f) => f.local)]),
            [['hunspell', ['pair.dic', 'pair.aff', 'other.dic', 'other.aff']]],
        );
    });

    it('refuses two Hunspell files with the same name', async () => {
        await assert.rejects(
            getAnswers(options({ name: 'clash', srcFiles: ['pair.dic', 'sub/pair.dic'], locale: 'xx' }), repo, root),
            /would both be copied to src\/hunspell\/pair\.dic/,
        );
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

    it('fails on a missing source without --placeholder-word-lists', async () => {
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

    it('leaves out languageSettings when nothing tells what enables it', async () => {
        const settings = await getAnswers(options({ name: 'companies', srcFiles: ['words.txt'] }), repo, root);
        assert.equal(settings.languageSettings, false);
        assert.equal(settings.enableForAllFiles, false);
        assert.equal(settings.locale, '*');
        assert.equal(settings.languageId, '*');
    });

    it('fails when a typed "*" leaves the locale and the file type both "*"', async () => {
        for (const answers of [
            { name: 'companies', locale: '*' },
            { name: 'companies', languageId: '*' },
            { name: 'en_IN', locale: '*' },
        ]) {
            await assert.rejects(
                getAnswers(options({ srcFiles: ['words.txt'], ...answers }), repo, root),
                /can't both be "\*"/,
                JSON.stringify(answers),
            );
        }
    });

    it('keeps the locale from the name when only the file type is typed as "*"', async () => {
        const settings = await getAnswers(
            options({ name: 'en_IN', srcFiles: ['words.txt'], languageId: '*' }),
            repo,
            root,
        );
        assert.equal(settings.languageSettings, true);
        assert.equal(settings.locale, 'en-IN');
        assert.equal(settings.languageId, '*');
    });

    it('takes no locale from the name when a file type is given', async () => {
        for (const languageSettings of [true, false]) {
            const settings = await getAnswers(
                options({ name: 'en_IN', srcFiles: ['words.txt'], languageId: 'erlang' }, { languageSettings }),
                repo,
                root,
            );
            assert.equal(settings.locale, '*');
            assert.equal(settings.languageId, 'erlang');
            assert.equal(settings.languageSettings, languageSettings);
        }
    });

    it('fails when the locale and the file type are both given as "*"', async () => {
        await assert.rejects(
            getAnswers(options({ name: 'ruby', srcFiles: ['words.txt'], locale: '*', languageId: '*' }), repo, root),
            /can't both be "\*"\. To enable the dictionary for every file, give --enable-for-all-files/,
        );
    });

    it('takes the locale only from a whole name', async () => {
        const whole = await getAnswers(options({ name: 'de_CH', srcFiles: ['words.txt'] }), repo, root);
        assert.equal(whole.locale, 'de-CH');
        assert.equal(whole.languageSettings, true);
        for (const name of ['it-terms', 'en_GB-legacy']) {
            const part = await getAnswers(options({ name, srcFiles: ['words.txt'] }), repo, root);
            assert.equal(part.locale, '*', name);
            assert.equal(part.languageSettings, false, name);
        }
    });

    it('keeps the locale and the file type without languageSettings, for the samples', async () => {
        const settings = await getAnswers(
            options(
                { name: 'slang', srcFiles: ['words.txt'], locale: 'de', languageId: 'ruby' },
                { languageSettings: false },
            ),
            repo,
            root,
        );
        assert.equal(settings.languageSettings, false);
        assert.equal(settings.locale, 'de');
        assert.equal(settings.languageId, 'ruby');
    });

    it('allows both "*" without languageSettings', async () => {
        const settings = await getAnswers(
            options(
                { name: 'slang', srcFiles: ['words.txt'], locale: '*', languageId: '*' },
                { languageSettings: false },
            ),
            repo,
            root,
        );
        assert.equal(settings.languageSettings, false);
    });

    it('takes the locale from the name without languageSettings', async () => {
        const settings = await getAnswers(
            options({ name: 'en_AU', srcFiles: ['words.txt'] }, { languageSettings: false }),
            repo,
            root,
        );
        assert.equal(settings.locale, 'en-AU');
        assert.equal(settings.languageSettings, false);
    });

    it('does not need the locale or the file type to skip the prompts without languageSettings', async () => {
        const settings = await getAnswers(
            options(
                {
                    name: 'companies',
                    friendlyName: 'Companies',
                    packageDescription: 'Companies.',
                    keywords: [],
                    srcFiles: ['words.txt'],
                    contributors: [],
                    doBuild: false,
                },
                { yes: false, languageSettings: false },
            ),
            repo,
            root,
        );
        assert.equal(settings.languageSettings, false);
    });

    it('fails for a name that is a locale when both are given as "*"', async () => {
        await assert.rejects(
            getAnswers(options({ name: 'en_IN', srcFiles: ['words.txt'], locale: '*', languageId: '*' }), repo, root),
            /can't both be "\*"/,
        );
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
