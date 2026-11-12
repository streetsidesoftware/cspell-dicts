import { basename, resolve } from 'node:path';

import { isHunspellFile } from './hunspell.mts';
import type { CommandLine } from './options.mts';
import { warn } from './output.mts';
import type { Questions } from './questions.mts';
import { checkFile, checkFolder, hunspellFile, parseSources, sourceWarnings, srcDir, wordList } from './sources.mts';
import type { Source, SourceOptions } from './sources.mts';

/** The sources given on their own, then those defined by the options and the prompts. */
export async function askSources(
    name: string,
    options: CommandLine,
    cwd: string,
    questions: Questions,
): Promise<Source[]> {
    const { noPrompts } = questions;
    const all: SourceOptions = structuredClone(options.sourceOptions);
    const plain = await givenSources(name, options, cwd, questions);
    // Every Hunspell file given on its own is a file of the one source `hunspell`.
    const named = new Map<string, Source>();
    for (const source of plain) {
        if (!source.name) continue;
        const other = named.get(source.name);
        if (other) other.files.push(...source.files);
        else named.set(source.name, { ...source, files: [...source.files] });
    }
    if (!noPrompts && named.has('hunspell')) await askAboutHunspell(all, cwd, questions);
    if (!noPrompts) await askDefined(all, cwd, questions);
    const sources = checkCopies(
        [...plain.filter((s) => !s.name), ...parseSources(all, cwd, [...named.values()])],
        options,
    );
    for (const source of sources) {
        for (const warning of sourceWarnings(source, noPrompts)) warn(warning);
    }
    return sources;
}

/** The sources given on their own: word lists, and Hunspell files. */
async function givenSources(name: string, options: CommandLine, cwd: string, questions: Questions): Promise<Source[]> {
    const files = options.answers.srcFiles;
    const { placeholderWordLists } = options;
    if (files === undefined && questions.noPrompts) {
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
        let source = await askSource(name + '.txt', false, placeholderWordLists, cwd, questions);
        while (source) {
            list.push(source);
            source = await askSource(undefined, true, placeholderWordLists, cwd, questions);
        }
        return list;
    }
    for (const file of files) {
        const valid = validatePath(file, cwd);
        if (valid !== true) throw new Error(valid);
        list.push(isHunspellFile(file) ? hunspellFile(file, cwd) : givenWordList(file, placeholderWordLists, cwd));
    }
    return list;
}

/** Asks for the license, README, and URL of the Hunspell files, unless options gave them. */
async function askAboutHunspell(all: SourceOptions, cwd: string, { ask }: Questions): Promise<void> {
    const hasHunspell = (list: string[]) => list.some((value) => /^hunspell[=/]/.test(value));
    const exists = (v: string) => !v.trim() || checkFile(cwd, v.trim());
    // Each file goes into src/hunspell/ under its own name.
    const asLocal = (path: string) => `hunspell/${basename(path)}=${path}`;
    if (!hasHunspell(all.addSourceLicense)) {
        const license = await ask.input({
            message: "The Hunspell files' license file; empty to skip:",
            validate: exists,
        });
        if (license.trim()) all.addSourceLicense.push(asLocal(license.trim()));
    }
    if (!hasHunspell(all.addSourceReadme)) {
        const readme = await ask.input({ message: "The Hunspell files' README; empty to skip:", validate: exists });
        if (readme.trim()) all.addSourceReadme.push(asLocal(readme.trim()));
    }
    if (!hasHunspell(all.addSourceUrl)) {
        const url = await ask.input({ message: 'URL where the Hunspell files can be found; empty to skip:' });
        if (url.trim()) all.addSourceUrl.push(`hunspell=${url.trim()}`);
    }
}

/** Asks for named sources, as the options would give them. */
async function askDefined(all: SourceOptions, cwd: string, { ask }: Questions): Promise<void> {
    for (;;) {
        const folder = (
            await ask.input({
                message: 'Third-party source folder; empty to finish:',
                validate: (v) => !v.trim() || checkFolder(cwd, v.trim()),
            })
        ).trim();
        if (!folder) return;
        const inFolder = (v: string) => !v.trim() || checkFile(resolve(cwd, folder), v.trim());
        const name = await ask.input({ message: 'Its name:', default: basename(resolve(cwd, folder)) });
        all.defineSource.push(`${name}=${folder}`);
        const withLocal = async (path: string) => {
            const local = await ask.input({ message: `Its path in src/${name}/:`, default: path });
            return local === path ? `${name}=${path}` : `${name}/${local}=${path}`;
        };
        for (;;) {
            const file = await ask.input({
                message: `A word list or Hunspell file in ${folder}; empty to finish:`,
                validate: inFolder,
            });
            if (!file.trim()) break;
            all.addSourceFile.push(await withLocal(file.trim()));
        }
        const license = await ask.input({ message: 'Its license file; empty to skip:', validate: inFolder });
        if (license.trim()) all.addSourceLicense.push(await withLocal(license.trim()));
        const readme = await ask.input({ message: 'Its README; empty to skip:', validate: inFolder });
        if (readme.trim()) all.addSourceReadme.push(await withLocal(readme.trim()));
        const url = await ask.input({ message: 'URL where it can be found; empty to skip:' });
        if (url.trim()) all.addSourceUrl.push(`${name}=${url.trim()}`);
    }
}

function givenWordList(file: string, placeholderWordLists: boolean, cwd: string): Source {
    const found = checkFile(cwd, file);
    if (found !== true && !placeholderWordLists) {
        throw new Error(`${found} Give --placeholder-word-lists to start with an empty word list.`);
    }
    return wordList(file, cwd, found !== true);
}

/** A path, and for a Hunspell file, its pair. A missing word list is a placeholder or an error, decided later. */
function validatePath(file: string, cwd: string): string | true {
    if (!file.trim()) return 'Give the path to a word list or Hunspell .dic file.';
    return isHunspellFile(file) ? checkFile(cwd, file) : true;
}

/** A source file, or with `another`, undefined for an empty answer. */
async function askSource(
    def: string | undefined,
    another: boolean,
    placeholderWordLists: boolean,
    cwd: string,
    { ask }: Questions,
): Promise<Source | undefined> {
    for (;;) {
        const typed = await ask.input({
            message: another ? 'Another source file; empty to finish:' : 'Source file:',
            default: def,
            validate: (v) => (another && !v.trim()) || validatePath(v, cwd),
        });
        if (!typed.trim()) return undefined;
        if (isHunspellFile(typed)) return hunspellFile(typed, cwd);
        if (checkFile(cwd, typed) === true) return wordList(typed, cwd, false);
        const message = `${typed} not found. Create an empty placeholder, src/${basename(typed)}?`;
        if (placeholderWordLists || (await ask.confirm({ message, default: true }))) {
            return wordList(typed, cwd, true);
        }
    }
}

/**
 * Drop a file given twice, such as a Hunspell pair given as both its .dic and its .aff, and refuse two files copied to
 * the same path.
 */
function checkCopies(list: Source[], options: CommandLine): Source[] {
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
