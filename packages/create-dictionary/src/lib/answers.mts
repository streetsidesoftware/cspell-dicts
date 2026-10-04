import { existsSync } from 'node:fs';
import { basename, resolve } from 'node:path';

import { confirm, input } from '@inquirer/prompts';

import { title, toFriendlyName } from './names.mts';
import { type Answers, type CommandLine, optionForAnswer } from './options.mts';
import { readTakenNames, type Repo } from './repo.mts';
import { isHunspellFile } from './source.mts';
import { nameValidator, sourceValidator, type Validate, validateDescription, validateLanguageId } from './validate.mts';

export type Settings = Required<Answers> & {
    /** The source is missing: start with an empty word list. */
    emptySource: boolean;
};

/**
 * The answers given as options, then defaults (with --yes) or prompts for the rest.
 */
export async function getAnswers(options: CommandLine, repo: Repo, cwd: string): Promise<Settings> {
    const { answers: given, yes, allowMissingSource } = options;
    const validateSource = sourceValidator(cwd);
    const keys = Object.keys(optionForAnswer) as (keyof Answers)[];
    const missing = keys.filter((key) => given[key] === undefined && !(key === 'srcFile' && allowMissingSource));
    const noPrompts = yes || !missing.length;
    if (!noPrompts && !process.stdin.isTTY) {
        const options = missing.map((key) => optionForAnswer[key]).join(', ');
        throw new Error(`No terminal to prompt in. Give --yes, or all of: ${options}.`);
    }

    async function text(key: TextKey, message: string, def?: string, validate?: Validate) {
        const value = given[key] ?? (noPrompts ? def : undefined);
        if (value === undefined && !noPrompts) return input({ message, default: def, validate });
        const valid = validate?.(value ?? '') ?? true;
        if (valid !== true) throw new Error(`${optionForAnswer[key]}: ${valid}`);
        return value ?? '';
    }

    async function yesNo(key: BooleanKey, message: string, def: boolean) {
        return given[key] ?? (noPrompts ? def : confirm({ message, default: def }));
    }

    async function source(name: string): Promise<{ srcFile: string; emptySource: boolean }> {
        const srcFile = given.srcFile;
        if (srcFile === undefined && noPrompts) {
            if (!allowMissingSource) {
                throw new Error(
                    'missing source. Give <source> or --source, or --allow-missing-source to start with an empty word list.',
                );
            }
            return { srcFile: name + '.txt', emptySource: true };
        }
        if (srcFile !== undefined) {
            const valid = validateSource(srcFile);
            if (valid !== true) throw new Error(valid);
            const found = existsSync(resolve(cwd, srcFile));
            if (!found && !allowMissingSource) {
                throw new Error(`${srcFile} not found. Give --allow-missing-source to start with an empty word list.`);
            }
            return { srcFile, emptySource: !found };
        }
        for (;;) {
            const typed = await input({
                message: 'Source File Name',
                default: name + '.txt',
                validate: validateSource,
            });
            if (existsSync(resolve(cwd, typed))) return { srcFile: typed, emptySource: false };
            const message = `${typed} not found. Create an empty src/${basename(typed)}?`;
            if (allowMissingSource || (await confirm({ message, default: true }))) {
                return { srcFile: typed, emptySource: true };
            }
        }
    }

    const taken = await readTakenNames(repo);
    const name = await text(
        'name',
        'The directory name for the dictionary (en_US, medical-terms)',
        undefined,
        nameValidator(repo, taken),
    );
    const friendlyName = await text(
        'friendlyName',
        'Friendly Name ("US English", "Medical Terms")',
        toFriendlyName(name),
    );
    const description = await text(
        'description',
        'Description: the words it covers ("Ruby keywords and standard library names")',
        undefined,
        validateDescription,
    );
    const packageDescription = await text(
        'packageDescription',
        'Description on npm',
        title(friendlyName) + ' dictionary for cspell.',
    );
    const { srcFile, emptySource } = await source(name);
    const locale = await text(
        'locale',
        'Language locale, example: "en,en-US" for English and English US, "fr" for French, or use "*" for programming language dictionaries.',
        '*',
    );
    const anyLocale = locale.trim() === '*';
    const languageId = await text(
        'languageId',
        'Programming languageID/filetype, i.e. "typescript", "php", "go", or "*" for any.',
        anyLocale && !noPrompts ? undefined : '*',
        validateLanguageId(anyLocale),
    );
    const isHunspell = isHunspellFile(srcFile);
    const useTrie = await yesNo(
        'useTrie',
        'Store as Trie: Mainly used for natural language dictionaries to store their large sizes.',
        isHunspell,
    );
    const doBuild = await yesNo('doBuild', 'Compile Dictionary?', isHunspell);

    return {
        name,
        friendlyName,
        description,
        packageDescription,
        srcFile,
        emptySource,
        locale,
        languageId,
        useTrie,
        doBuild,
    };
}

type TextKey = { [K in keyof Answers]-?: Answers[K] extends string | undefined ? K : never }[keyof Answers];
type BooleanKey = { [K in keyof Answers]-?: Answers[K] extends boolean | undefined ? K : never }[keyof Answers];
