import { statSync } from 'node:fs';
import { basename, resolve } from 'node:path';

import { checkbox, confirm, input } from '@inquirer/prompts';

import { title, toFriendlyName } from './names.mts';
import { type Answers, type CommandLine, optionForAnswer } from './options.mts';
import { gitUserName, readTakenNames, type Repo } from './repo.mts';
import { isHunspellFile } from './hunspell.mts';
import { findLocales, localeName, localeWarnings } from './locales.mts';
import {
    addSample,
    checkSample,
    fetchSeattle,
    languageOf,
    parseSamples,
    type Sample,
    sampleWarnings,
} from './samples.mts';
import {
    checkFile,
    checkFolder,
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
    type Validate,
    validateContributor,
    validateKeyword,
    validateDescription,
    validateLanguageId,
} from './validate.mts';

/** Word lists larger than this, in bytes, are stored as a trie by default, as the guide says. */
const largeWordLists = 1_000_000;

export type Settings = Omit<Required<Answers>, 'srcFiles'> & {
    sources: Source[];
    samples: Sample[];
    hunspellDepth: number;
    additionalWords: boolean;
    excludeWords: boolean;
};

/**
 * The answers given as options, then defaults (with --yes) or prompts for the rest.
 */
export async function getAnswers(options: CommandLine, repo: Repo, cwd: string): Promise<Settings> {
    const { answers: given, yes, placeholderWordLists } = options;
    const keys = Object.keys(optionForAnswer) as (keyof Answers)[];
    const missing = keys.filter((key) => given[key] === undefined && !(key === 'srcFiles' && placeholderWordLists));
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

    /** Asks a yes/no question, with an optional explanation on the line above it. */
    async function yesNo(key: BooleanKey, message: string, def: boolean, intro?: string) {
        const value = given[key] ?? (noPrompts ? def : undefined);
        if (value !== undefined) return value;
        if (intro) console.log('\n' + intro);
        return confirm({ message, default: def });
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
                    'Contributor, as "Name", "Name <email>", or "Name (url)", such as a GitHub profile; empty to skip:',
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
            message: 'Other keywords people search npm for, such as golang for Go; comma separated, empty to skip:',
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
            if (!placeholderWordLists) {
                throw new Error(
                    'missing source. Give <source> or --source, or --placeholder-word-lists to start with an empty word list.',
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
            const valid = validatePath(file);
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
        // Every Hunspell file given on its own is a file of the one source `hunspell`.
        const named = new Map<string, Source>();
        for (const source of plain) {
            if (!source.name) continue;
            const other = named.get(source.name);
            if (other) other.files.push(...source.files);
            else named.set(source.name, { ...source, files: [...source.files] });
        }
        const sources = checkCopies([...plain.filter((s) => !s.name), ...parseSources(all, cwd, [...named.values()])]);
        for (const source of sources) {
            for (const warning of sourceWarnings(source)) console.warn('warning: ' + warning);
        }
        return sources;
    }

    /** The samples from the options, the Wikipedia article on Seattle for a natural language, then from the prompts. */
    async function allSamples(locale: string): Promise<Sample[]> {
        const list = parseSamples(options.sampleOptions, cwd);
        const byName = new Map(list.map((sample) => [sample.name, sample]));
        const language = languageOf(locale);
        if (language && options.wikipediaSample && !byName.has('seattle.md')) {
            const message = `Fetch the start of the Wikipedia article on Seattle, in ${language}, as a sample?`;
            if (noPrompts || (await confirm({ message, default: true }))) {
                const seattle = await fetchSeattle(language);
                if (seattle) {
                    byName.set(seattle.name, seattle);
                    list.push(seattle);
                } else {
                    console.log(
                        `Couldn't fetch the Wikipedia article on Seattle in ${language}, so there's no samples/seattle.md.`,
                    );
                }
            }
        }
        if (!noPrompts) {
            console.log('\nA sample is a real file of the kind this dictionary is for. Its tests spell check it.');
            while (await confirm({ message: 'Add a sample?', default: !list.length })) {
                const path = await input({ message: 'Its path:', validate: (v) => checkSample(byName, v, cwd) });
                const sample = addSample(byName, path, cwd);
                const origin = await input({ message: 'Where it came from (URL or a few words); empty if unknown:' });
                if (origin.trim()) sample.origin = origin.trim();
                list.push(sample);
            }
        }
        for (const warning of sampleWarnings(list, locale)) console.warn('warning: ' + warning);
        return list;
    }

    /**
     * The locale, with each item that isn't a known locale offered as the locales its name could mean, when it was typed
     * at the prompt. Anything still unknown is a warning, not an error: cspell takes any locale.
     */
    async function checkedLocale(value: string): Promise<string> {
        let locale = value;
        if (!noPrompts && given.locale === undefined) {
            const items: string[] = [];
            for (const item of value.split(',').map((each) => each.trim())) {
                const matches = item === '*' || localeName(item) ? [] : findLocales(item);
                if (!matches.length) {
                    items.push(item);
                    continue;
                }
                const choices = matches.map(({ locale, name, ownName }) => ({
                    name: `${locale}: ${ownName ? `${ownName}, ${name}` : name}`,
                    value: locale,
                }));
                const message = `"${item}" isn't a locale. Pick the ones you meant (none keeps "${item}"):`;
                const picked = await checkbox({ message, choices });
                items.push(...(picked.length ? picked : [item]));
            }
            locale = items.join(',');
        }
        for (const warning of localeWarnings(locale)) console.warn('warning: ' + warning);
        return locale;
    }

    /** Asks for named sources, as the options would give them. */
    async function askDefined(all: SourceOptions): Promise<void> {
        while (await confirm({ message: 'Add a third-party source?', default: false })) {
            const folder = await input({ message: 'Its folder:', validate: (v) => checkFolder(cwd, v) });
            const inFolder = (v: string) => !v.trim() || checkFile(resolve(cwd, folder), v.trim());
            const name = await input({ message: 'Its name:', default: basename(resolve(cwd, folder)) });
            all.defineSource.push(`${name}=${folder}`);
            const withLocal = async (path: string) => {
                const local = await input({ message: `Its path in src/${name}/:`, default: path });
                return local === path ? `${name}=${path}` : `${name}/${local}=${path}`;
            };
            for (;;) {
                const file = await input({
                    message: `A word list or Hunspell file in ${folder}; empty when done:`,
                    validate: inFolder,
                });
                if (!file.trim()) break;
                all.addSourceFile.push(await withLocal(file.trim()));
            }
            const license = await input({ message: 'Its license file; empty to skip:', validate: inFolder });
            if (license.trim()) all.addSourceLicense.push(await withLocal(license.trim()));
            const readme = await input({ message: 'Its README; empty to skip:', validate: inFolder });
            if (readme.trim()) all.addSourceReadme.push(await withLocal(readme.trim()));
            const url = await input({ message: 'Where it can be found (URL); empty to skip:' });
            if (url.trim()) all.addSourceUrl.push(`${name}=${url.trim()}`);
        }
    }

    function givenWordList(file: string): Source {
        const found = checkFile(cwd, file);
        if (found !== true && !placeholderWordLists) {
            throw new Error(`${found} Give --placeholder-word-lists to start with an empty word list.`);
        }
        return wordList(file, cwd, found !== true);
    }

    /** A path, and for a Hunspell file, its pair. A missing word list is a placeholder or an error, decided later. */
    function validatePath(file: string): string | true {
        if (!file.trim()) return 'Give the path to a word list or Hunspell .dic file.';
        return isHunspellFile(file) ? checkFile(cwd, file) : true;
    }

    async function askSource(def: string | undefined): Promise<Source> {
        for (;;) {
            const typed = await input({ message: 'Source file:', default: def, validate: validatePath });
            if (isHunspellFile(typed)) return hunspellFile(typed, cwd);
            if (checkFile(cwd, typed) === true) return wordList(typed, cwd, false);
            const message = `${typed} not found. Create an empty placeholder, src/${basename(typed)}?`;
            if (placeholderWordLists || (await confirm({ message, default: true }))) return wordList(typed, cwd, true);
        }
    }

    /**
     * Drop a file given twice, such as a Hunspell pair given as both its .dic and its .aff, and refuse two files
     * copied to the same path.
     */
    function checkCopies(list: Source[]): Source[] {
        // The files create-dictionary writes in src/ itself.
        const copies = new Map<string, string>([['src/README.md', 'src/README.md']]);
        if (options.additionalWords) copies.set('src/additional_words.txt', 'src/additional_words.txt');
        if (options.excludeWords) copies.set('src/exclude_words.txt', 'src/exclude_words.txt');
        const result: Source[] = [];
        for (const source of list) {
            const files = source.files.filter((file) => {
                const to = srcDir(source) + file.local;
                const from = resolve(source.root, file.path);
                const other = copies.get(to);
                if (other === from) return false;
                if (other !== undefined) {
                    throw new Error(`${other} and ${from} would both be copied to ${to}. Rename one of them.`);
                }
                copies.set(to, from);
                return true;
            });
            if (files.length) result.push({ ...source, files });
        }
        return result;
    }

    const taken = await readTakenNames(repo);
    const name = await text(
        'name',
        'Directory name, such as en_US or medical-terms:',
        undefined,
        nameValidator(repo, taken),
    );
    const friendlyName = await text(
        'friendlyName',
        'Friendly name, such as "US English" or "Medical Terms":',
        toFriendlyName(name),
    );
    const description = await text(
        'description',
        'Description, the words it covers, such as "Ruby keywords and standard library names":',
        undefined,
        validateDescription,
    );
    const packageDescription = await text(
        'packageDescription',
        'Description on npm:',
        title(friendlyName) + ' dictionary for cspell.',
    );
    const people = await contributors();
    const searchWords = await keywords();
    const sources = await allSources(name);
    const locale = await checkedLocale(
        await text(
            'locale',
            'Locales, the natural languages it is for, comma separated, such as "en,en-US", or names such as "English"; "*" for any:',
            '*',
        ),
    );
    const anyLocale = locale.trim() === '*';
    const languageId = await text(
        'languageId',
        'File type, the programming languages or file types it is for, such as "typescript" or "go"; "*" for any:',
        anyLocale && !noPrompts ? undefined : '*',
        validateLanguageId(anyLocale),
    );
    const isHunspell = sources.some((source) => source.files.some((f) => isHunspellFile(f.path)));
    const useTrie = await yesNo(
        'useTrie',
        'Store it as a trie?',
        isHunspell || wordListBytes(sources) > largeWordLists,
        'A trie is much smaller for large word lists.',
    );
    const doBuild = await yesNo(
        'doBuild',
        'Build it now?',
        !isHunspell,
        isHunspell ? 'A Hunspell dictionary can take a long time to build.' : undefined,
    );

    const samples = await allSamples(locale);

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
        locale,
        languageId,
        useTrie,
        doBuild,
    };
}

type TextKey = { [K in keyof Answers]-?: Answers[K] extends string | undefined ? K : never }[keyof Answers];
type BooleanKey = { [K in keyof Answers]-?: Answers[K] extends boolean | undefined ? K : never }[keyof Answers];

/** The size of every word list to copy, in bytes. */
function wordListBytes(sources: Source[]): number {
    const files = sources.flatMap((s) =>
        s.files.filter((f) => !f.empty && !isHunspellFile(f.path)).map((f) => resolve(s.root, f.path)),
    );
    return files.reduce((total, file) => total + statSync(file).size, 0);
}
