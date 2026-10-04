import { existsSync } from 'node:fs';
import { basename, resolve } from 'node:path';

import { confirm, input } from '@inquirer/prompts';

import { title, toFriendlyName } from './names.mts';
import { type Answers, type CommandLine, optionForAnswer } from './options.mts';
import { readTakenNames, type Repo } from './repo.mts';
import { hunspellPair, isHunspellFile, sourceFile } from './source.mts';
import { nameValidator, sourceValidator, type Validate, validateDescription, validateLanguageId } from './validate.mts';

export interface Source {
    /** The path as given, relative to where the command runs; a Hunspell source is its .dic file. */
    file: string;
    /** The file is missing: start with an empty word list. */
    empty: boolean;
}

export type Settings = Omit<Required<Answers>, 'srcFiles'> & {
    sources: Source[];
};

/**
 * The answers given as options, then defaults (with --yes) or prompts for the rest.
 */
export async function getAnswers(options: CommandLine, repo: Repo, cwd: string): Promise<Settings> {
    const { answers: given, yes, allowMissingSource } = options;
    const validateSource = sourceValidator(cwd);
    const keys = Object.keys(optionForAnswer) as (keyof Answers)[];
    const missing = keys.filter((key) => given[key] === undefined && !(key === 'srcFiles' && allowMissingSource));
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

    async function sources(name: string): Promise<Source[]> {
        const files = given.srcFiles;
        if (files !== undefined) return checkCopies(files.map(givenSource));
        if (noPrompts) {
            if (!allowMissingSource) {
                throw new Error(
                    'missing source. Give <source> or --source, or --allow-missing-source to start with an empty word list.',
                );
            }
            return [{ file: name + '.txt', empty: true }];
        }
        const asked = [await askSource(name + '.txt')];
        while (await confirm({ message: 'Add another source file?', default: false })) {
            asked.push(await askSource());
        }
        return checkCopies(asked);
    }

    function givenSource(file: string): Source {
        const valid = validateSource(file);
        if (valid !== true) throw new Error(valid);
        const found = existsSync(resolve(cwd, file));
        if (!found && !allowMissingSource) {
            throw new Error(`${file} not found. Give --allow-missing-source to start with an empty word list.`);
        }
        return { file: sourceFile(file), empty: !found };
    }

    async function askSource(def?: string): Promise<Source> {
        for (;;) {
            const typed = await input({ message: 'Source file', default: def, validate: validateSource });
            if (existsSync(resolve(cwd, typed))) return { file: sourceFile(typed), empty: false };
            const message = `${typed} not found. Create an empty src/${basename(typed)}?`;
            if (allowMissingSource || (await confirm({ message, default: true }))) {
                return { file: typed, empty: true };
            }
        }
    }

    /** Drop a source given twice, such as both files of a Hunspell pair, and refuse two copied to the same file. */
    function checkCopies(list: Source[]): Source[] {
        const bySource = new Map(list.map((source) => [resolve(cwd, source.file), source]));
        const copies = new Map<string, string>();
        for (const { file } of bySource.values()) {
            for (const copy of isHunspellFile(file) ? hunspellPair(file) : [file]) {
                const other = copies.get(basename(copy));
                if (other !== undefined) {
                    throw new Error(
                        `${other} and ${copy} would both be copied to src/${basename(copy)}. Rename one of them.`,
                    );
                }
                copies.set(basename(copy), copy);
            }
        }
        return [...bySource.values()];
    }

    const taken = await readTakenNames(repo);
    const name = await text(
        'name',
        'The package directory name (en_US, medical-terms)',
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
    const srcs = await sources(name);
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
    const isHunspell = srcs.some((source) => isHunspellFile(source.file));
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
        sources: srcs,
        locale,
        languageId,
        useTrie,
        doBuild,
    };
}

type TextKey = { [K in keyof Answers]-?: Answers[K] extends string | undefined ? K : never }[keyof Answers];
type BooleanKey = { [K in keyof Answers]-?: Answers[K] extends boolean | undefined ? K : never }[keyof Answers];
