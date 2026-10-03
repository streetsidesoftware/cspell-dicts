#!/usr/bin/env node

// Creates a dictionary package in dictionaries/<name>/. Run with --help for usage.

import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { confirm, input } from '@inquirer/prompts';

import { type Answers, optionForAnswer, parseCommandLine } from './options.mts';
import { readTakenNames, type TakenNames } from './taken-names.mts';

const rootDir = fileURLToPath(new URL('../', import.meta.url));
const templateDir = fileURLToPath(new URL('templates/', import.meta.url));
const dictionariesDir = join(rootDir, 'dictionaries');

const templateFiles = [
    'package.json',
    'README.md',
    'cspell-ext.json',
    'cspell.json',
    'LICENSE',
    'cspell-tools.config.yaml',
    'dict/README.md',
    'src/README.md',
];

const hunspellExtensions = ['.dic', '.aff'];

const maxNameLength = 50;
const windowsReservedNames = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i;

type Validate = (value: string) => string | true;

async function main(): Promise<void> {
    const { answers: given, yes, allowMissingSource } = parseCommandLine(process.argv.slice(2));
    // `pnpm run` starts in the repo root; resolve the source from where the command was typed.
    const cwd = process.env.INIT_CWD ?? process.cwd();
    const answers = await getAnswers(given, yes, allowMissingSource, cwd);
    createPackage(answers, cwd);
}

type Settings = Required<Answers> & {
    /** The source is missing: start with an empty word list. */
    emptySource: boolean;
};

async function getAnswers(given: Answers, yes: boolean, allowMissingSource: boolean, cwd: string): Promise<Settings> {
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

    function validateSource(srcFile: string): string | true {
        if (!srcFile.trim()) return 'Give the path to a word list or Hunspell .dic file.';
        if (!isHunspellFile(srcFile)) return true;
        const notFound = hunspellPair(srcFile).filter((file) => !existsSync(resolve(cwd, file)));
        if (!notFound.length) return true;
        return `A Hunspell source needs both its .dic and .aff files. Not found: ${notFound.join(' and ')}`;
    }

    const taken = await readTakenNames(dictionariesDir);
    const name = await text(
        'name',
        'The package directory name (en_US, medical-terms)',
        undefined,
        nameValidator(taken),
    );
    const friendlyName = await text(
        'friendlyName',
        'Friendly Name ("US English", "Medical Terms")',
        toFriendlyName(name),
    );
    const description = await text('description', 'Description', title(friendlyName) + ' dictionary for cspell.');
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

    return { name, friendlyName, description, srcFile, emptySource, locale, languageId, useTrie, doBuild };
}

function validateLanguageId(anyLocale: boolean): Validate {
    return (value) => {
        if (!value.trim()) return 'missing. Give a file type, such as ruby.';
        if (anyLocale && value.trim() === '*') {
            return '"*" with a locale of "*" turns the dictionary on for every file. Set the locale for a natural language, or the file type for anything else.';
        }
        return true;
    };
}

type TextKey = { [K in keyof Answers]-?: Answers[K] extends string | undefined ? K : never }[keyof Answers];
type BooleanKey = { [K in keyof Answers]-?: Answers[K] extends boolean | undefined ? K : never }[keyof Answers];

function isHunspellFile(file: string): boolean {
    return hunspellExtensions.includes(extname(file));
}

/** The .dic and .aff files of a Hunspell source. */
function hunspellPair(file: string): string[] {
    const ext = extname(file);
    return hunspellExtensions.map((e) => join(dirname(file), basename(file, ext) + e));
}

function createPackage(answers: Settings, cwd: string): void {
    const { name, friendlyName, useTrie } = answers;
    const packageDir = join(dictionariesDir, name);
    const packageName = toPackageName(name);
    const dstFileName = `dict/${packageName}.${useTrie ? 'trie' : 'txt'}`;

    const srcFile = resolve(cwd, answers.srcFile);
    const isHunspell = isHunspellFile(srcFile);

    const values: Record<string, string> = {
        name,
        friendlyName,
        description: answers.description,
        locale: answers.locale,
        languageId: answers.languageId,
        packageName,
        fullPackageName: '@cspell/dict-' + packageName,
        srcFile: 'src/' + basename(srcFile),
        dstFullFileName: dstFileName,
        format: useTrie ? 'trie3' : 'plaintext',
        generateNonStrict: useTrie ? 'true' : 'false',
        srcFileReader: isHunspell ? 'hunspell-reader words -n 1000 -m 0' : 'head -n 1000',
        prepareScript: isHunspell ? 'echo OK' : 'pnpm run build',
        prepublishOnlyScript: 'echo OK',
        year: String(new Date().getFullYear()),
    };

    console.log('Creating ' + relative(rootDir, packageDir));
    for (const file of templateFiles) {
        const template = readFileSync(join(templateDir, file), 'utf8');
        write(file, fillTemplate(template, values, extname(file)));
    }
    if (answers.emptySource) {
        write(values.srcFile, `# ${title(friendlyName)} Terms\n`);
    } else {
        for (const file of isHunspell ? hunspellPair(srcFile) : [srcFile]) {
            copyFileSync(file, created(join('src', basename(file))));
        }
    }
    write(dstFileName, '# dest');

    run(packageDir, ['install']);
    if (answers.doBuild) {
        run(packageDir, ['run', 'build']);
        run(packageDir, ['run', 'prepare:dictionary']);
    }

    function created(file: string): string {
        const path = join(packageDir, file);
        mkdirSync(dirname(path), { recursive: true });
        console.log('   create ' + relative(rootDir, path));
        return path;
    }

    function write(file: string, content: string): void {
        writeFileSync(created(file), content);
    }
}

/**
 * Replace each `<%= key %>` with its value, escaped for the file type.
 */
function fillTemplate(template: string, values: Record<string, string>, ext: string): string {
    return template.replaceAll(/<%= (\w+) %>/g, (_, key: string) => {
        const value = values[key];
        if (value === undefined) throw new Error(`Unknown template value: ${key}`);
        if (ext === '.json') return JSON.stringify(value).slice(1, -1);
        if (ext === '.yaml') return value.replaceAll("'", "''");
        return value;
    });
}

function run(cwd: string, args: string[]): void {
    const result = spawnSync('pnpm', args, { cwd, stdio: 'inherit', shell: process.platform === 'win32' });
    if (result.status !== 0) throw new Error(`pnpm ${args.join(' ')} failed in ${relative(rootDir, cwd)}`);
}

function nameValidator(taken: TakenNames): Validate {
    return (name) => {
        if (!name) return 'missing. Give the package directory name, such as en_AU or ruby.';
        if (!/^[\w-]+$/.test(name)) return `"${name}" can only have letters, digits, "_", and "-".`;
        if (name.length > maxNameLength) return `"${name}" is longer than ${maxNameLength} characters.`;
        if (windowsReservedNames.test(name)) return `"${name}" is reserved on Windows. Choose another name.`;
        if (existsSync(join(dictionariesDir, name))) return `dictionaries/${name} already exists. Choose another name.`;
        const packageName = toPackageName(name);
        const fullPackageName = '@cspell/dict-' + packageName;
        const pkgOwner = taken.packages.get(fullPackageName);
        if (pkgOwner) return `the package name ${fullPackageName} is already used by ${pkgOwner}. Choose another name.`;
        const idOwner = taken.dictionaryIds.get(packageName);
        if (idOwner) return `the dictionary ID ${packageName} is already used by ${idOwner}. Choose another name.`;
        return true;
    };
}

/** The package name and dictionary ID: lowercase, with characters other than a-z, 0-9, and "-" replaced by "-". */
function toPackageName(name: string): string {
    return name.toLowerCase().replaceAll(/[^a-z0-9-]/g, '-');
}

function toFriendlyName(name: string): string {
    return name.split('-').map(title).join(' ');
}

function title(s: string): string {
    return s.slice(0, 1).toUpperCase() + s.slice(1);
}

try {
    await main();
} catch (e) {
    console.error('error: ' + (e instanceof Error ? e.message : String(e)));
    process.exitCode = 1;
}
