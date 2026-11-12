import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, beforeEach, describe, it } from 'node:test';

import { getAnswers } from './answers.mts';
import type { Answers, CommandLine } from './options.mts';
import type { Prompts } from './questions.mts';
import type { Repo } from './repo.mts';
import { noSampleOptions } from './samples.mts';
import { noSourceOptions } from './sources.mts';

/** The messages of the questions asked. */
let asked: string[] = [];

const prompts: Prompts = {
    input: async ({ message, default: def }) => {
        asked.push(message);
        return def ?? (message.startsWith('File types') ? 'ruby' : '');
    },
    confirm: async ({ message, default: def }) => {
        asked.push(message);
        return def ?? false;
    },
    checkbox: async ({ message }) => {
        asked.push(message);
        return [];
    },
    select: async <Value,>({ message }: { message: string }) => {
        asked.push(message);
        return 'files' as Value;
    },
};

const kindQuestion = 'What is this dictionary for?';

let root = '';
let repo: Repo;
const stdinIsTTY = process.stdin.isTTY;

before(() => {
    root = mkdtempSync(join(tmpdir(), 'create-dictionary-prompts-'));
    repo = { rootDir: root, dictionariesDir: join(root, 'dictionaries') };
    mkdirSync(repo.dictionariesDir);
    writeFileSync(join(root, 'words.txt'), 'zorbal\n');
    process.stdin.isTTY = true;
});

after(() => {
    process.stdin.isTTY = stdinIsTTY;
    rmSync(root, { recursive: true, force: true });
});

beforeEach(() => {
    asked = [];
});

function prompted(answers: Answers, more: Partial<CommandLine> = {}) {
    const commandLine: CommandLine = {
        answers: { srcFiles: ['words.txt'], description: 'Test words', ...answers },
        yes: false,
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
    return getAnswers(commandLine, repo, root, prompts);
}

describe('getAnswers at the prompts', () => {
    it('asks what the dictionary is for when nothing determines it', async () => {
        const settings = await prompted({ name: 'medical-terms' });
        assert.ok(asked.includes(kindQuestion), asked.join('\n'));
        assert.equal(settings.languageSettings, true);
        assert.equal(settings.languageId, 'ruby');
    });

    it('fails before any enabling question when the locale and the file type are both "*"', async () => {
        for (const name of ['medical-terms', 'en_IN']) {
            await assert.rejects(
                prompted({ name, locale: '*', languageId: '*' }),
                /can't both be "\*"\. To enable the dictionary for every file, give --enable-for-all-files/,
            );
            assert.ok(!asked.includes(kindQuestion), asked.join('\n'));
        }
    });

    it('asks for the file type, not the kind, when the locale is given as "*"', async () => {
        const settings = await prompted({ name: 'en_IN', locale: '*' });
        assert.ok(!asked.includes(kindQuestion), asked.join('\n'));
        assert.equal(settings.locale, '*');
        assert.equal(settings.languageId, 'ruby');
    });

    it('asks nothing about enabling with --no-language-settings', async (t) => {
        const log = t.mock.method(console, 'log', () => undefined);
        const settings = await prompted({ name: 'en_TT' }, { languageSettings: false });
        assert.ok(!asked.includes(kindQuestion), asked.join('\n'));
        assert.ok(!asked.some((message) => message.startsWith('Locales')), asked.join('\n'));
        assert.equal(settings.languageSettings, false);
        assert.equal(settings.locale, 'en-TT');
        const output = log.mock.calls.map((call) => call.arguments.join(' ')).join('\n');
        assert.match(output, /The locale is .*from the name/);
    });
});
