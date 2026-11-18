import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, beforeEach, describe, it, mock } from 'node:test';

import { askSources } from './ask-sources.mts';
import type { Answers, CommandLine } from './options.mts';
import { createQuestions } from './questions.mts';
import { noSampleOptions } from './samples.mts';
import { noSourceOptions } from './sources.mts';
import type { SourceOptions } from './sources.mts';
import { scriptedPrompts } from './test-prompts.mts';
import type { Asked, Script } from './test-prompts.mts';

let root = '';
let warnings: string[] = [];

before(() => {
    root = mkdtempSync(join(tmpdir(), 'create-dictionary-ask-sources-'));
    for (const file of ['words.txt', 'pair.dic', 'pair.aff', 'LICENSE', 'README.md', 'exclude_words.txt']) {
        writeFileSync(join(root, file), 'zorbal\n');
    }
    mkdirSync(join(root, 'aoo'));
    for (const file of ['terms.txt', 'LICENSE']) writeFileSync(join(root, 'aoo', file), 'zorbal\n');
    mock.method(console, 'log', () => undefined);
    mock.method(console, 'warn', (_format: string, _label: string, message: string) => warnings.push(message));
});

after(() => {
    mock.restoreAll();
    rmSync(root, { recursive: true, force: true });
});

beforeEach(() => {
    warnings = [];
});

describe('askSources at the prompts', () => {
    it('asks for source files until an empty answer, then for Hunspell details and other sources', async () => {
        const script = { input: ['words.txt', 'pair.dic', '', 'aoo/LICENSE', '', '', ''] };
        const { sources, asked } = await prompted({}, script);
        assert.deepEqual(
            asked.map(({ message }) => message),
            [
                'Source file:',
                'Another source file; empty to finish:',
                'Another source file; empty to finish:',
                "The Hunspell files' license file; empty to skip:",
                "The Hunspell files' README; empty to skip:",
                'URL where the Hunspell files can be found; empty to skip:',
                'Third-party source folder; empty to finish:',
            ],
        );
        assert.equal(asked[0].default, 'medical-terms.txt');
        assert.deepEqual(sources[0].files, [{ path: 'words.txt', local: 'words.txt', empty: false }]);
        assert.equal(sources[1].name, 'hunspell');
        assert.deepEqual(
            sources[1].files.map((file) => file.path),
            ['pair.dic', 'pair.aff'],
        );
        // Copied into src/hunspell/ under its own name.
        assert.deepEqual(sources[1].license, { path: 'aoo/LICENSE', local: 'LICENSE' });
        assert.deepEqual(warnings, ['the source hunspell has no README, URL.']);
    });

    it('offers an empty placeholder for a missing word list', async () => {
        const { sources, asked } = await prompted({}, { input: ['', '', ''], confirm: [true] });
        assert.equal(
            asked[1].message,
            'medical-terms.txt not found. Create an empty placeholder, src/medical-terms.txt?',
        );
        assert.deepEqual(sources[0].files, [{ path: 'medical-terms.txt', local: 'medical-terms.txt', empty: true }]);
    });

    it('asks for the file again when the placeholder is declined', async () => {
        const { sources, asked } = await prompted({}, { input: ['nope.txt', 'words.txt', '', ''], confirm: [false] });
        assert.equal(asked[2].message, 'Source file:');
        assert.deepEqual(sources[0].files, [{ path: 'words.txt', local: 'words.txt', empty: false }]);
    });

    it('makes the placeholder without asking with --placeholder-word-lists', async () => {
        const { sources, asked } = await prompted({}, { input: ['nope.txt', '', ''] }, { placeholderWordLists: true });
        assert.ok(!asked.some(({ message }) => message.includes('placeholder')));
        assert.equal(sources[0].files[0].empty, true);
    });

    it('rejects a Hunspell file that is missing', async () => {
        const { asked } = await prompted({}, { input: ['missing.dic', 'words.txt', '', ''] });
        assert.deepEqual(asked[0].rejected, ['missing.dic']);
    });

    it('asks only for the Hunspell details the options leave out', async () => {
        const sourceOptions = { ...noSourceOptions, addSourceLicense: ['hunspell=LICENSE'] };
        const script = { input: ['README.md', 'https://example.com/pair', ''] };
        const { sources, asked } = await prompted({ srcFiles: ['pair.dic'] }, script, { sourceOptions });
        assert.ok(!asked.some(({ message }) => message.includes('license')));
        const [hunspell] = sources;
        assert.deepEqual(hunspell.license, { path: 'LICENSE', local: 'LICENSE' });
        assert.deepEqual(hunspell.readme, { path: 'README.md', local: 'README.md' });
        assert.equal(hunspell.url, 'https://example.com/pair');
        assert.deepEqual(warnings, []);
    });

    it('defines a third-party source from its folder, files, and details', async () => {
        const script = {
            input: [
                ...['nope', 'aoo', ''], // the folder, retyped, then its name: the folder's
                ...['missing.txt', 'terms.txt', '', ''], // a file, retyped, its path in src/aoo/, then done
                ...['LICENSE', 'COPYING'], // its license, copied as src/aoo/COPYING
                ...['', 'https://example.com/aoo', ''], // no README, its URL, then no other folder
            ],
        };
        const { sources, asked } = await prompted({ srcFiles: ['words.txt'] }, script);
        assert.deepEqual(asked[0].rejected, ['nope']);
        assert.deepEqual(asked.find(({ message }) => message.startsWith('A word list'))?.rejected, ['missing.txt']);
        const aoo = sources.find((source) => source.name === 'aoo');
        assert.deepEqual(aoo?.files, [{ path: 'terms.txt', local: 'terms.txt' }]);
        assert.deepEqual(aoo?.license, { path: 'LICENSE', local: 'COPYING' });
        assert.equal(aoo?.readme, undefined);
        assert.equal(aoo?.url, 'https://example.com/aoo');
    });
});

describe('askSources without prompts', () => {
    it('warns about a named source with nothing recorded, naming the options', async () => {
        await withoutPrompts({ srcFiles: ['pair.dic'] });
        assert.deepEqual(warnings, [
            'the source hunspell has no license (--add-source-license), README (--add-source-readme), URL (--add-source-url).',
        ]);
    });

    it('fails on a Hunspell file that is missing', async () => {
        await assert.rejects(withoutPrompts({ srcFiles: ['missing.dic'] }), /missing\.dic/);
    });

    it('starts with only the defined sources when no word list is given', async () => {
        const sourceOptions = { ...noSourceOptions, defineSource: ['aoo'], addSourceFile: ['aoo=terms.txt'] };
        const sources = await withoutPrompts({}, { sourceOptions });
        assert.deepEqual(
            sources.map((source) => source.name),
            ['aoo'],
        );
    });

    it('refuses a word list copied over a file create-dictionary writes', async () => {
        await assert.rejects(
            withoutPrompts({ srcFiles: ['exclude_words.txt'] }),
            /would both be copied to src\/exclude_words\.txt/,
        );
        const sources = await withoutPrompts({ srcFiles: ['exclude_words.txt'] }, { excludeWords: false });
        assert.equal(sources[0].files[0].local, 'exclude_words.txt');
    });
});

/** The sources for a dictionary named medical-terms, from the options and the scripted prompts. */
async function prompted(answers: Answers, script: Script, more: Partial<CommandLine> = {}) {
    const asked: Asked[] = [];
    const options = commandLine(answers, more);
    const questions = createQuestions(options.answers, false, scriptedPrompts(script, asked));
    const sources = await askSources('medical-terms', options, root, questions);
    return { sources, asked };
}

function withoutPrompts(answers: Answers, more: Partial<CommandLine> = {}) {
    const options = commandLine(answers, more);
    return askSources('medical-terms', options, root, createQuestions(options.answers, true, scriptedPrompts({})));
}

function commandLine(answers: Answers, more: Partial<CommandLine>): CommandLine {
    return {
        answers,
        yes: false,
        placeholderWordLists: false,
        sourceOptions: structuredClone(noSourceOptions) as SourceOptions,
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
