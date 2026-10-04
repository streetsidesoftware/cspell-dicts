import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, describe, it } from 'node:test';

import type { Repo, TakenNames } from './repo.mts';
import {
    nameValidator,
    sourceValidator,
    validateContributor,
    validateKeyword,
    validateDescription,
    validateLanguageId,
} from './validate.mts';

let root = '';
let repo: Repo;

before(() => {
    root = mkdtempSync(join(tmpdir(), 'create-dictionary-validate-'));
    repo = { rootDir: root, dictionariesDir: join(root, 'dictionaries') };
    mkdirSync(join(repo.dictionariesDir, 'existing'), { recursive: true });
    writeFileSync(join(root, 'words.txt'), 'zorbal\n');
    writeFileSync(join(root, 'pair.dic'), '1\nzorbal\n');
    writeFileSync(join(root, 'pair.aff'), 'SET UTF-8\n');
    writeFileSync(join(root, 'lonely.dic'), '1\nzorbal\n');
});

after(() => rmSync(root, { recursive: true, force: true }));

describe('nameValidator', () => {
    const taken: TakenNames = {
        packages: new Map([['@cspell/dict-en-au', 'dictionaries/en_AU']]),
        dictionaryIds: new Map([['en-au-extra', 'dictionaries/en_AU']]),
    };
    const validate = () => nameValidator(repo, taken);

    it('accepts a new name', () => {
        assert.equal(validate()('ruby'), true);
        assert.equal(validate()('en_GB'), true);
    });

    it('refuses an empty name', () => {
        assert.match(String(validate()('')), /missing/);
    });

    it('refuses characters other than letters, digits, "_", and "-"', () => {
        assert.match(String(validate()('a.b')), /can only have letters/);
        assert.match(String(validate()('a b')), /can only have letters/);
    });

    it('refuses names over 50 characters', () => {
        assert.equal(validate()('a'.repeat(50)), true);
        assert.match(String(validate()('a'.repeat(51))), /longer than 50/);
    });

    it('refuses names reserved on Windows, in any case', () => {
        for (const name of ['con', 'NUL', 'Com1', 'lpt9']) {
            assert.match(String(validate()(name)), /reserved on Windows/, name);
        }
        assert.equal(validate()('console'), true);
    });

    it('refuses an existing directory', () => {
        assert.match(String(validate()('existing')), /dictionaries\/existing already exists/);
    });

    it('refuses a package name or dictionary ID already in use', () => {
        assert.match(String(validate()('en-AU')), /package name @cspell\/dict-en-au is already used/);
        assert.match(String(validate()('en_au_extra')), /dictionary ID en-au-extra is already used/);
    });
});

describe('validateDescription', () => {
    it('refuses an empty description', () => {
        assert.match(String(validateDescription(' ')), /missing/);
    });

    it('accepts a description of the words', () => {
        assert.equal(validateDescription('Ruby keywords and standard library names'), true);
    });
});

describe('validateContributor', () => {
    it('accepts a name, with an optional <email> and (url)', () => {
        for (const person of [
            'Jane Doe',
            'Jane Doe <jane@example.com>',
            'Jane Doe (https://example.com/jane-doe)',
            'Jane Doe <jane@example.com> (https://example.com/jane-doe)',
            'Example Project (https://example.org)',
        ]) {
            assert.equal(validateContributor(person), true, person);
        }
    });

    it('refuses a missing name, or parts out of order or unclosed', () => {
        for (const person of [
            '',
            '<jane@example.com>',
            'Jane Doe <jane@example.com',
            'Ana (https://x.y) <jane@example.com>',
        ]) {
            assert.match(String(validateContributor(person)), /isn't "Name"/, person);
        }
    });
});

describe('validateKeyword', () => {
    it('accepts a word or a phrase', () => {
        assert.equal(validateKeyword('golang'), true);
        assert.equal(validateKeyword('Go language'), true);
    });

    it('refuses an empty keyword, or several in one', () => {
        assert.match(String(validateKeyword(' ')), /empty/);
        assert.match(String(validateKeyword('go,golang')), /one keyword per --keyword/);
    });
});

describe('validateLanguageId', () => {
    it('refuses an empty file type', () => {
        assert.match(String(validateLanguageId(false)('  ')), /missing/);
    });

    it('refuses "*" when the locale is "*" too', () => {
        assert.match(String(validateLanguageId(true)('*')), /every file/);
    });

    it('accepts "*" with a locale, and a file type with any locale', () => {
        assert.equal(validateLanguageId(false)('*'), true);
        assert.equal(validateLanguageId(true)('ruby'), true);
    });
});

describe('sourceValidator', () => {
    const validate = () => sourceValidator(root);

    it('refuses an empty path', () => {
        assert.match(String(validate()(' ')), /Give the path/);
    });

    it('accepts a word list, found or not', () => {
        assert.equal(validate()('words.txt'), true);
        assert.equal(validate()('missing.txt'), true);
    });

    it('accepts a complete Hunspell pair from either file', () => {
        assert.equal(validate()('pair.dic'), true);
        assert.equal(validate()('pair.aff'), true);
    });

    it('refuses an incomplete Hunspell pair', () => {
        assert.match(String(validate()('lonely.dic')), /Not found: lonely\.aff/);
        assert.match(String(validate()('gone.dic')), /Not found: gone\.dic and gone\.aff/);
    });
});
