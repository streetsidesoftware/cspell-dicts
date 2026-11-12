import { statSync } from 'node:fs';
import { resolve } from 'node:path';

import { askSources } from './ask-sources.mts';
import { askEnabling } from './enabling.mts';
import { gatherSamples } from './gather-samples.mts';
import { isHunspellFile } from './hunspell.mts';
import { conventionalName, friendlyNameFromLocale } from './locales.mts';
import { title, toFriendlyName, toPackageName } from './names.mts';
import { optionForAnswer } from './options.mts';
import type { Answers, CommandLine } from './options.mts';
import { asDefault, explain, header, key, link, literal, warn } from './output.mts';
import { createQuestions, sectionCount, terminalPrompts } from './questions.mts';
import type { Prompts, Questions } from './questions.mts';
import { gitUserName, readTakenNames } from './repo.mts';
import type { Repo } from './repo.mts';
import { samplesExplanation, sampleWarnings } from './samples.mts';
import type { Sample } from './samples.mts';
import type { Source } from './sources.mts';
import { nameValidator, validateContributor, validateDescription, validateKeyword } from './validate.mts';

/** Word lists larger than this, in bytes, are stored as a trie by default, as the guide says. */
const largeWordLists = 1_000_000;

export type Settings = Omit<Required<Answers>, 'srcFiles'> & {
    sources: Source[];
    samples: Sample[];
    hunspellDepth: number;
    additionalWords: boolean;
    excludeWords: boolean;
    enableForAllFiles: boolean;
    languageSettings: boolean;
};

/**
 * The answers given as options, then defaults (with --yes) or prompts for the rest.
 */
export async function getAnswers(
    options: CommandLine,
    repo: Repo,
    cwd: string,
    prompts: Prompts = terminalPrompts,
): Promise<Settings> {
    const { answers: given } = options;
    const missing = missingAnswers(options);
    const noPrompts = options.yes || !missing.length;
    if (!noPrompts && !process.stdin.isTTY) {
        const names = missing.map((key) => optionForAnswer[key]).join(', ');
        throw new Error(`No terminal to prompt in. Give --yes, or all of: ${names}.`);
    }
    const questions = createQuestions(given, noPrompts, prompts);
    const { section, info, text, yesNo } = questions;

    if (!noPrompts) showIntroduction();
    section(1, 'Dictionary Info');
    const taken = await readTakenNames(repo);
    const typedName = await text('name', 'Directory name, such as en_US or medical-terms:', undefined, (value) =>
        nameValidator(repo, taken)(conventionalName(value)),
    );
    // Names follow the repo's convention: medical-terms, en_AU, german.
    const name = conventionalName(typedName);
    if (name !== typedName) info('The name is %s, as dictionary names are written.', literal(name));
    const id = toPackageName(name);
    info('Package %s, dictionary ID %s.', literal(`@cspell/dict-${id}`), literal(id));
    const friendlyName = await text(
        'friendlyName',
        'Friendly name, such as "US English" or "Medical Terms":',
        // A name typed with spaces, such as "Medical Terms", is already a friendly name.
        /\s/.test(typedName.trim())
            ? typedName.trim().split(/\s+/).join(' ')
            : (friendlyNameFromLocale(name) ?? toFriendlyName(name)),
    );
    const description = await text(
        'description',
        'Description, the words it covers, such as "Ruby keywords and standard library names":',
        languageDescription(name),
        validateDescription,
    );
    const packageDescription = await text(
        'packageDescription',
        'Description on npm:',
        title(friendlyName) + ' dictionary for cspell.',
    );
    const searchWords = await askKeywords(given, questions);
    section(2, "When It's Used");
    const enabling = await askEnabling(name, given, options.languageSettings, questions);
    section(3, 'Words');
    const sources = await askSources(name, options, cwd, questions);
    section(4, 'Samples');
    const samples = await askSamples(enabling.locale, enabling.languageId, options, cwd, questions);
    // The trie is chosen, never asked: few people know what one is. --trie and --no-trie override it.
    const isHunspell = sources.some((source) => source.files.some((f) => isHunspellFile(f.path)));
    const useTrie = given.useTrie ?? (isHunspell || wordListBytes(sources) > largeWordLists);
    section(5, 'Maintainers');
    const people = await askContributors(given, cwd, questions);
    section(6, 'Finish');
    const doBuild = await yesNo(
        'doBuild',
        'Build it now?',
        !isHunspell,
        isHunspell ? 'A Hunspell dictionary can take a long time to build.' : undefined,
    );

    return {
        name,
        friendlyName,
        description,
        packageDescription,
        contributors: people,
        keywords: searchWords,
        sources,
        samples,
        hunspellDepth: options.hunspellDepth,
        additionalWords: options.additionalWords,
        excludeWords: options.excludeWords,
        enableForAllFiles: options.enableForAllFiles,
        ...enabling,
        useTrie,
        doBuild,
    };
}

/** Nothing enables the dictionary: users add it to their settings. */
export function isDisabled({ languageSettings, enableForAllFiles }: Settings): boolean {
    return !languageSettings && !enableForAllFiles;
}

/** The answers a prompt would have to ask for. */
function missingAnswers(options: CommandLine): (keyof Answers)[] {
    const keys = Object.keys(optionForAnswer) as (keyof Answers)[];
    return keys.filter(
        (key) =>
            options.answers[key] === undefined &&
            key !== 'useTrie' &&
            !(key === 'srcFiles' && options.placeholderWordLists) &&
            !(!options.languageSettings && (key === 'locale' || key === 'languageId')),
    );
}

function showIntroduction(): void {
    header(
        'Create a dictionary for cspell',
        `The dictionary is created in a new folder in ${literal('dictionaries/')}.`,
        `To gather the information it needs, we'll ask you a series of short questions, grouped into ${sectionCount} sections.`,
        '',
        `Most questions have a default answer in ${asDefault('(parentheses)')}. Press ${key('Enter')} to accept it.`,
        '',
        `Guide: ${link('https://github.com/streetsidesoftware/cspell-dicts/blob/main/docs/guides/new-dictionary.md')}`,
        '',
        `Press ${key('Ctrl+C')} during the questions to stop without making changes.`,
    );
}

async function askContributors(given: Answers, cwd: string, { ask, noPrompts }: Questions): Promise<string[]> {
    const list = given.contributors;
    if (list !== undefined) {
        for (const person of list) {
            const valid = validateContributor(person);
            if (valid !== true) throw new Error(`${optionForAnswer.contributors}: ${valid}`);
        }
        return list.map((person) => person.trim());
    }
    if (noPrompts) return [];
    const asked: string[] = [];
    let def = gitUserName(cwd);
    for (;;) {
        const person = await ask.input({
            message: asked.length
                ? 'Another contributor; empty to finish:'
                : 'Contributor, as "Name", "Name <email>", or "Name (url)", such as a GitHub profile; empty to skip:',
            default: def,
            validate: (value) => !value.trim() || validateContributor(value),
        });
        if (!person.trim()) return asked;
        asked.push(person.trim());
        def = undefined;
    }
}

async function askKeywords(given: Answers, { ask, noPrompts }: Questions): Promise<string[]> {
    const list = given.keywords;
    if (list !== undefined) {
        for (const word of list) {
            const valid = validateKeyword(word);
            if (valid !== true) throw new Error(`${optionForAnswer.keywords}: ${valid}`);
        }
        return list.map((word) => word.trim());
    }
    if (noPrompts) return [];
    const typed = await ask.input({
        message: 'Other keywords people search npm for, such as golang for Go; comma separated, empty to skip:',
    });
    return typed
        .split(',')
        .map((word) => word.trim())
        .filter((word) => word);
}

/** The samples, with what they should be when prompting, and what's missing. */
async function askSamples(
    locale: string,
    languageId: string,
    options: CommandLine,
    cwd: string,
    { ask, info, noPrompts, showSection }: Questions,
): Promise<Sample[]> {
    if (!noPrompts) {
        showSection();
        explain(...samplesExplanation(locale, languageId));
    }
    const list = await gatherSamples(options.sampleOptions, {
        locale,
        cwd,
        prompt: !noPrompts,
        seattle: options.wikipediaSample,
        ask,
        info,
    });
    for (const warning of sampleWarnings(list, locale)) warn(warning);
    return list;
}

/** The size of every word list to copy, in bytes. */
function wordListBytes(sources: Source[]): number {
    const files = sources.flatMap((s) =>
        s.files.filter((f) => !f.empty && !isHunspellFile(f.path)).map((f) => resolve(s.root, f.path)),
    );
    return files.reduce((total, file) => total + statSync(file).size, 0);
}

/** For a dictionary whose name is a language or locale, such as en_AU: "Australian English dictionary". */
function languageDescription(name: string): string | undefined {
    const language = friendlyNameFromLocale(name);
    return language && `${language} dictionary`;
}
