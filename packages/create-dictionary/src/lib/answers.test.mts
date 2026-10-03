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
});

after(() => rmSync(root, { recursive: true, force: true }));

function options(answers: Answers, more: Partial<CommandLine> = {}): CommandLine {
    return { answers, yes: true, allowMissingSource: false, skipInstall: true, ...more };
}

// The tests run without a terminal, so nothing here prompts.
describe('getAnswers', () => {
    it('fills in defaults with --yes', async () => {
        const settings = await getAnswers(
            options({ name: 'medical-terms', srcFile: 'words.txt', languageId: 'markdown' }),
            repo,
            root,
        );
        assert.deepEqual(settings, {
            name: 'medical-terms',
            friendlyName: 'Medical Terms',
            description: 'Medical Terms dictionary for cspell.',
            srcFile: 'words.txt',
            emptySource: false,
            locale: '*',
            languageId: 'markdown',
            useTrie: false,
            doBuild: false,
        });
    });

    it('defaults to a trie and a build for a Hunspell source', async () => {
        const settings = await getAnswers(options({ name: 'xx', srcFile: 'pair.dic', locale: 'xx' }), repo, root);
        assert.equal(settings.useTrie, true);
        assert.equal(settings.doBuild, true);
    });

    it('keeps given values over defaults', async () => {
        const settings = await getAnswers(
            options({ name: 'ruby', srcFile: 'pair.dic', languageId: 'ruby', useTrie: false, doBuild: false }),
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
        assert.equal(settings.srcFile, 'ruby.txt');
        assert.equal(settings.emptySource, true);
    });

    it('marks a missing source as empty with --allow-missing-source', async () => {
        const settings = await getAnswers(
            options({ name: 'ruby', srcFile: 'nope.txt', languageId: 'ruby' }, { allowMissingSource: true }),
            repo,
            root,
        );
        assert.equal(settings.emptySource, true);
    });

    it('fails on a missing source without --allow-missing-source', async () => {
        await assert.rejects(
            getAnswers(options({ name: 'ruby', srcFile: 'nope.txt', languageId: 'ruby' }), repo, root),
            /nope\.txt not found/,
        );
    });

    it('fails without a source with --yes', async () => {
        await assert.rejects(getAnswers(options({ name: 'ruby', languageId: 'ruby' }), repo, root), /missing source/);
    });

    it('fails when the locale and the file type are both "*"', async () => {
        await assert.rejects(getAnswers(options({ name: 'ruby', srcFile: 'words.txt' }), repo, root), /every file/);
    });

    it('prefixes an invalid value with its option', async () => {
        await assert.rejects(
            getAnswers(options({ name: 'a.b', srcFile: 'words.txt', languageId: 'ruby' }), repo, root),
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
