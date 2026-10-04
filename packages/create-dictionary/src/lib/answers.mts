import { existsSync, statSync } from 'node:fs';
import { basename, resolve } from 'node:path';

import { confirm, input } from '@inquirer/prompts';

import { title, toFriendlyName } from './names.mts';
import { type Answers, type CommandLine, optionForAnswer } from './options.mts';
import { gitUserName, readTakenNames, type Repo } from './repo.mts';
import { isHunspellFile } from './hunspell.mts';
import {
    hunspellFile,
    parseSources,
    type Source,
    type SourceOptions,
    sourceWarnings,
    srcDir,
    wordList,
} from './sources.mts';
import {
    nameValidator,
    sourceValidator,
    type Validate,
    validateContributor,
    validateKeyword,
    validateDescription,
    validateLanguageId,
} from './validate.mts';

export type Settings = Omit<Required<Answers>, 'srcFiles'> & {
    sources: Source[];
    additionalWords: boolean;
    excludeWords: boolean;
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

    async function contributors(): Promise<string[]> {
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
            const person = await input({
                message:
                    'Contributor: "Name", "Name <email>", or "Name (url)", such as a GitHub profile; empty to skip',
                default: def,
                validate: (value) => !value.trim() || validateContributor(value),
            });
            if (!person.trim()) return asked;
            asked.push(person.trim());
            def = undefined;
            if (!(await confirm({ message: 'Add another contributor?', default: false }))) return asked;
        }
    }

    async function keywords(): Promise<string[]> {
        const list = given.keywords;
        if (list !== undefined) {
            for (const word of list) {
                const valid = validateKeyword(word);
                if (valid !== true) throw new Error(`${optionForAnswer.keywords}: ${valid}`);
            }
            return list.map((word) => word.trim());
        }
        if (noPrompts) return [];
        const typed = await input({
            message: 'Other names people search for, such as golang for Go; comma separated, empty to skip',
        });
        return typed
            .split(',')
            .map((word) => word.trim())
            .filter((word) => word);
    }

    /** The sources given on their own: word lists, and Hunspell files. */
    async function givenSources(name: string): Promise<Source[]> {
        const files = given.srcFiles;
        if (files === undefined && noPrompts) {
            if (options.sourceOptions.defineSource.length) return [];
            if (!allowMissingSource) {
                throw new Error(
                    'missing source. Give <source> or --source, or --allow-missing-source to start with an empty word list.',
                );
            }
            return [wordList(name + '.txt', cwd, true)];
        }
        const list: Source[] = [];
        if (files === undefined) {
            list.push(await askSource(name + '.txt'));
            while (await confirm({ message: 'Add another source file?', default: false })) {
                list.push(await askSource(undefined));
            }
            return list;
        }
        for (const file of files) {
            const valid = validateSource(file);
            if (valid !== true) throw new Error(valid);
            list.push(isHunspellFile(file) ? hunspellFile(file, cwd) : givenWordList(file));
        }
        return list;
    }

    /** The sources given on their own, then those defined by the options and the prompts. */
    async function allSources(name: string): Promise<Source[]> {
        const all: SourceOptions = structuredClone(options.sourceOptions);
        const plain = await givenSources(name);
        if (!noPrompts) await askDefined(all);
        const named: Source[] = [];
        for (const source of plain) {
            if (source.name && !named.some((other) => isSameSource(other, source))) named.push(source);
        }
        const sources = checkCopies([...plain.filter((s) => !s.name), ...parseSources(all, cwd, named)]);
        for (const source of sources) {
            for (const warning of sourceWarnings(source)) console.warn('warning: ' + warning);
        }
        return sources;
    }

    /** Asks for named sources, as the options would give them. */
    async function askDefined(all: SourceOptions): Promise<void> {
        const isFolder = (v: string) => {
            const path = resolve(cwd, v);
            return (existsSync(path) && statSync(path).isDirectory()) || `${v} isn't a folder.`;
        };
        while (await confirm({ message: 'Add a third-party source?', default: false })) {
            const folder = await input({ message: 'Its folder', validate: isFolder });
            const name = await input({ message: 'Its name', default: basename(resolve(cwd, folder)) });
            all.defineSource.push(`${name}=${folder}`);
            const withLocal = async (path: string) => {
                const local = await input({ message: `Its path in src/${name}/`, default: path });
                return local === path ? `${name}=${path}` : `${name}/${local}=${path}`;
            };
            for (;;) {
                const file = await input({ message: `A word list or Hunspell file in ${folder}; empty when done` });
                if (!file.trim()) break;
                all.addSourceFile.push(await withLocal(file.trim()));
            }
            const license = await input({ message: 'Its license file; empty to skip' });
            if (license.trim()) all.addSourceLicense.push(await withLocal(license.trim()));
            const readme = await input({ message: 'Its README; empty to skip' });
            if (readme.trim()) all.addSourceReadme.push(await withLocal(readme.trim()));
            const url = await input({ message: 'Where it can be found (URL); empty to skip' });
            if (url.trim()) all.addSourceUrl.push(`${name}=${url.trim()}`);
        }
    }

    function givenWordList(file: string): Source {
        const found = existsSync(resolve(cwd, file));
        if (!found && !allowMissingSource) {
            throw new Error(`${file} not found. Give --allow-missing-source to start with an empty word list.`);
        }
        return wordList(file, cwd, !found);
    }

    async function askSource(def: string | undefined): Promise<Source> {
        for (;;) {
            const typed = await input({ message: 'Source file', default: def, validate: validateSource });
            if (isHunspellFile(typed)) return hunspellFile(typed, cwd);
            if (existsSync(resolve(cwd, typed))) return wordList(typed, cwd, false);
            const message = `${typed} not found. Create an empty src/${basename(typed)}?`;
            if (allowMissingSource || (await confirm({ message, default: true }))) return wordList(typed, cwd, true);
        }
    }

    /** A Hunspell pair given as both its .dic and its .aff is one source. */
    function isSameSource(a: Source, b: Source): boolean {
        return a.root === b.root && a.files[0]?.path === b.files[0]?.path;
    }

    /** Drop a file given twice, and refuse two copied to the same path. */
    function checkCopies(list: Source[]): Source[] {
        const bySource = new Map(list.map((source) => [resolve(source.root, source.files[0]?.path ?? ''), source]));
        // The files create-dictionary writes in src/ itself.
        const copies = new Map<string, string>([['src/README.md', 'src/README.md']]);
        if (options.additionalWords) copies.set('src/additional_words.txt', 'src/additional_words.txt');
        if (options.excludeWords) copies.set('src/exclude_words.txt', 'src/exclude_words.txt');
        for (const source of bySource.values()) {
            for (const file of source.files) {
                const to = srcDir(source) + file.local;
                const other = copies.get(to);
                if (other !== undefined) {
                    throw new Error(`${other} and ${file.path} would both be copied to ${to}. Rename one of them.`);
                }
                copies.set(to, file.path);
            }
        }
        return [...bySource.values()];
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
    const people = await contributors();
    const searchWords = await keywords();
    const sources = await allSources(name);
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
    const isHunspell = sources.some((source) => source.files.some((f) => isHunspellFile(f.path)));
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
        contributors: people,
        keywords: searchWords,
        sources,
        additionalWords: options.additionalWords,
        excludeWords: options.excludeWords,
        locale,
        languageId,
        useTrie,
        doBuild,
    };
}

type TextKey = { [K in keyof Answers]-?: Answers[K] extends string | undefined ? K : never }[keyof Answers];
type BooleanKey = { [K in keyof Answers]-?: Answers[K] extends boolean | undefined ? K : never }[keyof Answers];
