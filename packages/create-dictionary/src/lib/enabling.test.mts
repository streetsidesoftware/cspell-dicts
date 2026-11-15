import assert from 'node:assert/strict';
import { after, before, describe, it, mock } from 'node:test';

import { askEnabling, kindFromOptions, localeGivenByName, usesLanguageSettings } from './enabling.mts';
import type { Answers } from './options.mts';
import { createQuestions } from './questions.mts';
import type { Prompts } from './questions.mts';

interface Asked {
    message: string;
    default?: string;
    choices?: { value: unknown; checked?: boolean }[];
}

interface Script {
    select?: string[];
    checkbox?: string[][];
    input?: string[];
}

before(() => {
    mock.method(console, 'log', () => undefined);
    mock.method(console, 'warn', () => undefined);
});

after(() => mock.restoreAll());

describe('askEnabling at the prompts', () => {
    it('offers the locales of the name, with its own ticked', async () => {
        const { result, asked } = await enabling('en_AU', {}, { checkbox: [['en-AU']] });
        assert.deepEqual(result, { languageSettings: true, locale: 'en-AU', languageId: '*' });
        assert.equal(asked.length, 1);
        assert.equal(asked[0].message, 'Locales for this dictionary:');
        const offered = asked[0].choices?.map((choice) => choice.value) ?? [];
        assert.ok(offered.includes('en-GB'), offered.join());
        assert.deepEqual(ticked(asked[0]), ['en-AU']);
    });

    it("offers the name's locale first when it isn't a known one", async () => {
        const { result, asked } = await enabling('en_NZ', {}, { checkbox: [['en-NZ']] });
        assert.equal(result.locale, 'en-NZ');
        assert.equal(asked[0].choices?.[0].value, 'en-NZ');
        assert.deepEqual(ticked(asked[0]), ['en-NZ']);
    });

    it('asks for the locale as text when none is ticked', async () => {
        const { result, asked } = await enabling('en_AU', {}, { checkbox: [[]], input: ['de'] });
        assert.equal(result.locale, 'de');
        assert.match(asked[1].message, /^Locales,/);
        assert.equal(asked[1].default, undefined);
    });

    it('adds a typed locale to the ticked ones for "Something else"', async () => {
        const { result, asked } = await enabling('en_AU', {}, { checkbox: [['en-AU', '']], input: ['de'] });
        assert.equal(result.locale, 'en-AU,de');
        assert.equal(asked[1].default, '');
    });

    it('offers the locales a typed language name could mean', async () => {
        const script = { select: ['language'], input: ['German'], checkbox: [['de-AT']] };
        const { result, asked } = await enabling('medical-terms', {}, script);
        assert.equal(result.locale, 'de-AT');
        assert.match(asked[2].message, /"German" isn't a locale/);
    });

    it('keeps a typed language name when none of its locales is picked', async () => {
        const script = { select: ['language'], input: ['German'], checkbox: [[]] };
        const { result } = await enabling('medical-terms', {}, script);
        assert.equal(result.locale, 'German');
    });

    it('asks nothing for a given locale and file type, and keeps both', async () => {
        const { result, asked } = await enabling('medical-terms', { locale: 'german', languageId: 'ruby' });
        assert.deepEqual(result, { languageSettings: true, locale: 'german', languageId: 'ruby' });
        assert.deepEqual(asked, []);
    });

    it('enables a given locale for every file type', async () => {
        const { result, asked } = await enabling('medical-terms', { locale: 'de' });
        assert.equal(result.languageId, '*');
        assert.deepEqual(asked, []);
    });
});

describe('askEnabling without prompts', () => {
    it('rejects a blank locale', async () => {
        for (const locale of [' ', '']) {
            const questions = createQuestions({ locale }, true, scripted({}, []));
            await assert.rejects(askEnabling('medical-terms', true, questions), /^Error: --locale: Give a locale/);
        }
    });

    it('writes a padded "*" locale as "*" for a file type', async () => {
        const questions = createQuestions({ locale: ' * ', languageId: 'ruby' }, true, scripted({}, []));
        const result = await askEnabling('medical-terms', true, questions);
        assert.deepEqual(result, { languageSettings: true, locale: '*', languageId: 'ruby' });
    });
});

describe('localeGivenByName', () => {
    it('takes the locale of a whole name', () => {
        assert.equal(localeGivenByName('en_AU', {}), 'en-AU');
        assert.equal(localeGivenByName('german', {}), 'de');
        assert.equal(localeGivenByName('en_IN', { languageId: '*' }), 'en-IN');
    });

    it('gives none for any other name', () => {
        assert.equal(localeGivenByName('it-terms', {}), undefined);
        assert.equal(localeGivenByName('en_GB-legacy', {}), undefined);
    });

    it('gives none when an option says otherwise', () => {
        assert.equal(localeGivenByName('en_IN', { locale: 'de' }), undefined);
        assert.equal(localeGivenByName('en_IN', { locale: '*' }), undefined);
        assert.equal(localeGivenByName('en_IN', { languageId: 'erlang' }), undefined);
    });
});

describe('usesLanguageSettings', () => {
    it('uses them for a given value, including a typed "*"', () => {
        assert.equal(usesLanguageSettings({ locale: 'de' }, undefined, true), true);
        assert.equal(usesLanguageSettings({ languageId: 'ruby' }, undefined, true), true);
        assert.equal(usesLanguageSettings({ locale: '*' }, undefined, true), true);
        assert.equal(usesLanguageSettings({ languageId: '*' }, undefined, true), true);
    });

    it('uses them for a locale from the name', () => {
        assert.equal(usesLanguageSettings({}, 'en-AU', true), true);
    });

    it('asks at the prompts, and leaves them out without prompts', () => {
        assert.equal(usesLanguageSettings({}, undefined, false), true);
        assert.equal(usesLanguageSettings({}, undefined, true), false);
    });
});

describe('kindFromOptions', () => {
    it('is a natural language for a locale', () => {
        assert.equal(kindFromOptions({ locale: 'de' }, undefined), 'language');
        assert.equal(kindFromOptions({}, 'en-AU'), 'language');
        assert.equal(kindFromOptions({ locale: 'de', languageId: 'ruby' }, undefined), 'language');
    });

    it('is file types for a file type, or a locale typed as "*"', () => {
        assert.equal(kindFromOptions({ languageId: 'ruby' }, undefined), 'files');
        assert.equal(kindFromOptions({ locale: '*' }, undefined), 'files');
    });

    it('is open otherwise', () => {
        assert.equal(kindFromOptions({}, undefined), undefined);
        assert.equal(kindFromOptions({ languageId: '*' }, undefined), undefined);
    });
});

/** How a dictionary with this name is enabled at the prompts, with the questions asked. */
async function enabling(name: string, given: Answers, script: Script = {}) {
    const asked: Asked[] = [];
    const result = await askEnabling(name, true, createQuestions(given, false, scripted(script, asked)));
    return { result, asked };
}

/** Prompts that give the script's answers in order and record each question; any other question fails. */
function scripted(script: Script, asked: Asked[]): Prompts {
    const answers = {
        select: [...(script.select ?? [])],
        checkbox: [...(script.checkbox ?? [])],
        input: [...(script.input ?? [])],
    };
    return {
        input: async ({ message, default: def }) => {
            asked.push({ message, default: def });
            return answers.input.shift() ?? assert.fail(`unexpected question: ${message}`);
        },
        confirm: async ({ message }) => assert.fail(`unexpected question: ${message}`),
        checkbox: async <Value,>({ message, choices }: { message: string; choices: readonly unknown[] }) => {
            asked.push({ message, choices: choices as Asked['choices'] });
            return (answers.checkbox.shift() ?? assert.fail(`unexpected question: ${message}`)) as Value[];
        },
        select: async <Value,>({ message }: { message: string }) => {
            asked.push({ message });
            return (answers.select.shift() ?? assert.fail(`unexpected question: ${message}`)) as Value;
        },
    };
}

function ticked(question: Asked): unknown[] {
    return (question.choices ?? []).filter((choice) => choice.checked).map((choice) => choice.value);
}
