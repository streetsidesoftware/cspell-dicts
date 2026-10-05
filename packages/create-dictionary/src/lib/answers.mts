import { statSync } from 'node:fs';
import { basename, resolve } from 'node:path';

import { checkbox, confirm, input, select } from '@inquirer/prompts';

import { title, toFriendlyName, toPackageName } from './names.mts';
import { type Answers, type CommandLine, optionForAnswer } from './options.mts';
import { gitUserName, readTakenNames, type Repo } from './repo.mts';
import { isHunspellFile } from './hunspell.mts';
import {
    conventionalName,
    findLocales,
    friendlyNameFromLocale,
    knownLocales,
    localeFromName,
    localeName,
    localeWarnings,
} from './locales.mts';
import {
    addSample,
    checkSample,
    articleOf,
    fetchArticle,
    languageOf,
    parseSamples,
    type Sample,
    samplesExplanation,
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
import {
    asDefault,
    explain,
    header,
    info as showInfo,
    key,
    link,
    literal,
    section as showSectionTitle,
    warn,
} from './output.mts';

/** Word lists larger than this, in bytes, are stored as a trie by default, as the guide says. */
const largeWordLists = 1_000_000;

/** The sections the questions are grouped in, as in the help. */
const sectionCount = 6;

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
    const missing = keys.filter(
        (key) => given[key] === undefined && key !== 'useTrie' && !(key === 'srcFiles' && placeholderWordLists),
    );
    const noPrompts = yes || !missing.length;
    if (!noPrompts && !process.stdin.isTTY) {
        const options = missing.map((key) => optionForAnswer[key]).join(', ');
        throw new Error(`No terminal to prompt in. Give --yes, or all of: ${options}.`);
    }

    let pendingSection: string | undefined;

    /** Starts a section; its title is shown before its first question, so a section answered by options shows none. */
    function section(n: number, title: string): void {
        // Without prompts there are no sections to show.
        pendingSection = noPrompts ? undefined : `Section (${n}/${sectionCount}): ${title}`;
    }

    function showSection(): void {
        if (pendingSection) showSectionTitle(pendingSection);
        pendingSection = undefined;
    }

    /** A note within the current section, under its title. */
    function info(format: string, ...values: unknown[]): void {
        showSection();
        showInfo(format, ...values);
    }

    const ask = {
        input: (config: Parameters<typeof input>[0]) => (showSection(), input(config)),
        confirm: (config: Parameters<typeof confirm>[0]) => (showSection(), confirm(config)),
        checkbox: <Value,>(config: Parameters<typeof checkbox<Value>>[0]) => (showSection(), checkbox(config)),
        select: <Value,>(config: Parameters<typeof select<Value>>[0]) => (showSection(), select(config)),
    };

    async function text(key: TextKey, message: string, def?: string, validate?: Validate) {
        const value = given[key] ?? (noPrompts ? def : undefined);
        if (value === undefined && !noPrompts) return ask.input({ message, default: def, validate });
        const valid = validate?.(value ?? '') ?? true;
        if (valid !== true) throw new Error(`${optionForAnswer[key]}: ${valid}`);
        return value ?? '';
    }

    /** Asks a yes/no question, with an optional explanation on the line above it. */
    async function yesNo(key: BooleanKey, message: string, def: boolean, intro?: string) {
        const value = given[key] ?? (noPrompts ? def : undefined);
        if (value !== undefined) return value;
        showSection();
        if (intro) explain(intro);
        return ask.confirm({ message, default: def });
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
            const person = await ask.input({
                message:
                    'Contributor, as "Name", "Name <email>", or "Name (url)", such as a GitHub profile; empty to skip:',
                default: def,
                validate: (value) => !value.trim() || validateContributor(value),
            });
            if (!person.trim()) return asked;
            asked.push(person.trim());
            def = undefined;
            if (!(await ask.confirm({ message: 'Add another contributor?', default: false }))) return asked;
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
        const typed = await ask.input({
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
            while (await ask.confirm({ message: 'Add another source file?', default: false })) {
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
        // Every Hunspell file given on its own is a file of the one source `hunspell`.
        const named = new Map<string, Source>();
        for (const source of plain) {
            if (!source.name) continue;
            const other = named.get(source.name);
            if (other) other.files.push(...source.files);
            else named.set(source.name, { ...source, files: [...source.files] });
        }
        if (!noPrompts && named.has('hunspell')) await askAboutHunspell(all);
        if (!noPrompts) await askDefined(all);
        const sources = checkCopies([...plain.filter((s) => !s.name), ...parseSources(all, cwd, [...named.values()])]);
        for (const source of sources) {
            for (const warning of sourceWarnings(source, noPrompts)) warn(warning);
        }
        return sources;
    }

    /** The samples from the options, the Wikipedia article on Seattle for a natural language, then from the prompts. */
    async function allSamples(locale: string, languageId: string): Promise<Sample[]> {
        const list = parseSamples(options.sampleOptions, cwd);
        const byName = new Map(list.map((sample) => [sample.name, sample]));
        const language = languageOf(locale);
        if (!noPrompts) {
            showSection();
            explain(...samplesExplanation(locale, languageId));
        }
        if (language) {
            /** Fetches an article into the samples. Without a network, or such an article, it says so and goes on. */
            const addArticle = async (titleOrUrl: string): Promise<boolean> => {
                const article = articleOf(titleOrUrl, language);
                const sample = await fetchArticle(article);
                if (!sample) {
                    info(
                        "Couldn't fetch the Wikipedia article %s in %s.",
                        literal(article.title),
                        localeName(article.language) ?? article.language,
                    );
                    return false;
                }
                if (byName.has(sample.name)) {
                    info('There is already a sample named %s.', literal(sample.name));
                    return false;
                }
                byName.set(sample.name, sample);
                list.push(sample);
                info('Added %s.', literal(`samples/${sample.name}`));
                return true;
            };
            const languageName = localeName(language) ?? language;
            if (options.wikipediaSample && !byName.has('seattle.md')) {
                const message = `Fetch the start of the Wikipedia article on Seattle, in ${languageName}, as a sample?`;
                if (noPrompts || (await ask.confirm({ message, default: true }))) await addArticle('Seattle');
            }
            for (const titleOrUrl of options.sampleOptions.addWikipediaSample) await addArticle(titleOrUrl);
            if (!noPrompts) {
                while (await ask.confirm({ message: 'Add another Wikipedia article as a sample?', default: false })) {
                    const titleOrUrl = await ask.input({
                        message: `Its title, in ${languageName} or English, or its link:`,
                        validate: (v) => !!v.trim() || 'Give a title or a link.',
                    });
                    await addArticle(titleOrUrl);
                }
            }
        }
        if (!noPrompts) {
            const another = () => (list.length ? 'Add another sample file?' : 'Add a sample file?');
            while (await ask.confirm({ message: another(), default: !list.length })) {
                const path = await ask.input({ message: 'Its path:', validate: (v) => checkSample(byName, v, cwd) });
                const sample = addSample(byName, path, cwd);
                const origin = await ask.input({
                    message: 'Where it came from (URL or a few words); empty if unknown:',
                });
                if (origin.trim()) sample.origin = origin.trim();
                list.push(sample);
            }
        }
        for (const warning of sampleWarnings(list, locale)) warn(warning);
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
                const picked = await ask.checkbox({ message, choices });
                items.push(...(picked.length ? picked : [item]));
            }
            locale = items.join(',');
        }
        for (const warning of localeWarnings(locale)) warn(warning);
        return locale;
    }

    /**
     * The locale. When the name stands for a language and the locale is asked, its locales are offered as a checklist,
     * with the one from the name ticked; "Something else" asks for it as text.
     */
    async function askLocale(nameLocale: string | undefined, required: boolean): Promise<string> {
        const typed = async (def: string | undefined) => {
            const value = await text(
                'locale',
                required
                    ? 'Locales, the natural languages it is for, comma separated, such as "en,en-US", or names such as "English":'
                    : 'Locales, the natural languages it is for, comma separated, such as "en,en-US", or names such as "English"; "*" for any:',
                def,
                required ? (v) => (v.trim() && v.trim() !== '*') || 'Give a locale or a language name.' : undefined,
            );
            return value.trim() ? checkedLocale(value) : '';
        };
        if (!nameLocale || noPrompts || given.locale !== undefined)
            return typed(nameLocale ?? (required ? undefined : '*'));
        const language = nameLocale.split('-')[0];
        const related = knownLocales().filter(({ locale }) => locale === language || locale.startsWith(language + '-'));
        if (!related.some(({ locale }) => locale === nameLocale)) {
            related.unshift({ locale: nameLocale, name: localeName(nameLocale) ?? nameLocale });
        }
        const other = '';
        const choices = [
            ...related.map(({ locale, name }) => ({
                name: `${locale}: ${name}`,
                value: locale,
                checked: locale === nameLocale,
            })),
            { name: 'Something else (type it)', value: other },
        ];
        const picked = await ask.checkbox({ message: 'Locales for this dictionary:', choices });
        const locales = picked.filter((locale) => locale !== other);
        if (picked.includes(other) || !locales.length) {
            const more = await typed(locales.length ? '' : undefined);
            if (more && more !== '*') locales.push(more);
        }
        return locales.length ? locales.join(',') : '*';
    }

    /** Asks for the license, README, and URL of the Hunspell files, unless options gave them. */
    async function askAboutHunspell(all: SourceOptions): Promise<void> {
        const given = (list: string[]) => list.some((value) => /^hunspell[=/]/.test(value));
        const exists = (v: string) => !v.trim() || checkFile(cwd, v.trim());
        // Each file goes into src/hunspell/ under its own name.
        const asLocal = (path: string) => `hunspell/${basename(path)}=${path}`;
        if (!given(all.addSourceLicense)) {
            const license = await ask.input({
                message: "The Hunspell files' license file; empty to skip:",
                validate: exists,
            });
            if (license.trim()) all.addSourceLicense.push(asLocal(license.trim()));
        }
        if (!given(all.addSourceReadme)) {
            const readme = await ask.input({ message: "The Hunspell files' README; empty to skip:", validate: exists });
            if (readme.trim()) all.addSourceReadme.push(asLocal(readme.trim()));
        }
        if (!given(all.addSourceUrl)) {
            const url = await ask.input({ message: 'Where the Hunspell files can be found (URL); empty to skip:' });
            if (url.trim()) all.addSourceUrl.push(`hunspell=${url.trim()}`);
        }
    }

    /** Asks for named sources, as the options would give them. */
    async function askDefined(all: SourceOptions): Promise<void> {
        while (await ask.confirm({ message: 'Add a third-party source?', default: false })) {
            const folder = await ask.input({ message: 'Its folder:', validate: (v) => checkFolder(cwd, v) });
            const inFolder = (v: string) => !v.trim() || checkFile(resolve(cwd, folder), v.trim());
            const name = await ask.input({ message: 'Its name:', default: basename(resolve(cwd, folder)) });
            all.defineSource.push(`${name}=${folder}`);
            const withLocal = async (path: string) => {
                const local = await ask.input({ message: `Its path in src/${name}/:`, default: path });
                return local === path ? `${name}=${path}` : `${name}/${local}=${path}`;
            };
            for (;;) {
                const file = await ask.input({
                    message: `A word list or Hunspell file in ${folder}; empty when done:`,
                    validate: inFolder,
                });
                if (!file.trim()) break;
                all.addSourceFile.push(await withLocal(file.trim()));
            }
            const license = await ask.input({ message: 'Its license file; empty to skip:', validate: inFolder });
            if (license.trim()) all.addSourceLicense.push(await withLocal(license.trim()));
            const readme = await ask.input({ message: 'Its README; empty to skip:', validate: inFolder });
            if (readme.trim()) all.addSourceReadme.push(await withLocal(readme.trim()));
            const url = await ask.input({ message: 'Where it can be found (URL); empty to skip:' });
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
            const typed = await ask.input({ message: 'Source file:', default: def, validate: validatePath });
            if (isHunspellFile(typed)) return hunspellFile(typed, cwd);
            if (checkFile(cwd, typed) === true) return wordList(typed, cwd, false);
            const message = `${typed} not found. Create an empty placeholder, src/${basename(typed)}?`;
            if (placeholderWordLists || (await ask.confirm({ message, default: true })))
                return wordList(typed, cwd, true);
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

    if (!noPrompts) {
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
    const searchWords = await keywords();
    section(2, "When It's Used");
    // A name such as en_AU or german stands for its locale.
    const nameLocale = localeFromName(name);
    if (nameLocale && noPrompts && given.locale === undefined) {
        info('The locale is %s, from the name. Give %s to change it.', literal(nameLocale), literal('--locale'));
    }
    // A natural language sets the locale, and anything else the file type, so only one of them is asked.
    const isSet = (value: string | undefined) => value !== undefined && value.trim() !== '*';
    let kind: 'language' | 'files' | undefined;
    if (isSet(given.locale) || (nameLocale && !isSet(given.languageId))) kind = 'language';
    else if (isSet(given.languageId)) kind = 'files';
    else if (!noPrompts) {
        kind = await ask.select({
            message: 'What is this dictionary for?',
            choices: [
                { name: 'A natural language, such as German or Australian English', value: 'language' as const },
                { name: 'Programming languages or file types, such as Ruby or Markdown', value: 'files' as const },
            ],
        });
    }
    const locale =
        kind === 'files' ? (given.locale ?? '*') : await askLocale(nameLocale, kind === 'language' && !noPrompts);
    const anyLocale = locale.trim() === '*';
    const languageId =
        kind === 'language' && !anyLocale && given.languageId === undefined
            ? '*'
            : await text(
                  'languageId',
                  'File types, the programming languages or file types it is for, comma separated, such as "ruby" or "markdown":',
                  anyLocale && !noPrompts ? undefined : '*',
                  validateLanguageId(anyLocale),
              );
    section(3, 'Words');
    const sources = await allSources(name);
    section(4, 'Samples');
    const samples = await allSamples(locale, languageId);
    // The trie is chosen, never asked: few people know what one is. --trie and --no-trie override it.
    const isHunspell = sources.some((source) => source.files.some((f) => isHunspellFile(f.path)));
    const useTrie = given.useTrie ?? (isHunspell || wordListBytes(sources) > largeWordLists);
    section(5, 'Maintainers');
    const people = await contributors();
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

/** For a dictionary whose name is a language or locale, such as en_AU: "Australian English dictionary". */
function languageDescription(name: string): string | undefined {
    const language = friendlyNameFromLocale(name);
    return language && `${language} dictionary`;
}
