#!/usr/bin/env node

// Creates a dictionary package in dictionaries/<name>/. Run with --help for usage.

import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { confirm, input } from '@inquirer/prompts';

import { type Answers, optionForAnswer, parseCommandLine } from './options.mts';

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

type Validate = (value: string) => string | true;

async function main(): Promise<void> {
    const { answers: given, yes } = parseCommandLine(process.argv.slice(2));
    // `pnpm run` starts in the repo root; resolve the source from where the command was typed.
    const cwd = process.env.INIT_CWD ?? process.cwd();
    const answers = await getAnswers(given, yes, cwd);
    createPackage(answers, cwd);
}

async function getAnswers(given: Answers, yes: boolean, cwd: string): Promise<Required<Answers>> {
    const keys = Object.keys(optionForAnswer) as (keyof Answers)[];
    const missing = keys.filter((key) => given[key] === undefined);
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

    const name = await text('name', 'The package directory name (en_US, medical-terms)', undefined, validateName);
    const friendlyName = await text(
        'friendlyName',
        'Friendly Name ("US English", "Medical Terms")',
        toFriendlyName(name),
    );
    const description = await text('description', 'Description', title(friendlyName) + ' dictionary for cspell.');
    const srcFile = await text('srcFile', 'Source File Name', name + '.txt');
    const locale = await text(
        'locale',
        'Language locale, example: "en,en-US" for English and English US, "fr" for French, or use "*" for programming language dictionaries.',
        '*',
    );
    const languageId = await text(
        'languageId',
        'Programming languageID/filetype, i.e. "typescript", "php", "go", or "*" for any.',
        '*',
    );
    const isHunspell = hunspellExtensions.includes(extname(srcFile));
    const useTrie = await yesNo(
        'useTrie',
        'Store as Trie: Mainly used for natural language dictionaries to store their large sizes.',
        isHunspell,
    );
    const doBuild = await yesNo('doBuild', 'Compile Dictionary?', isHunspell && existsSync(resolve(cwd, srcFile)));

    return { name, friendlyName, description, srcFile, locale, languageId, useTrie, doBuild };
}

type TextKey = { [K in keyof Answers]-?: Answers[K] extends string | undefined ? K : never }[keyof Answers];
type BooleanKey = { [K in keyof Answers]-?: Answers[K] extends boolean | undefined ? K : never }[keyof Answers];

function createPackage(answers: Required<Answers>, cwd: string): void {
    const { name, friendlyName, useTrie } = answers;
    const packageDir = join(dictionariesDir, name);
    const packageName = name.toLowerCase().replaceAll(/[^a-z0-9-]/g, '-');
    const dstFileName = `dict/${packageName}.${useTrie ? 'trie' : 'txt'}`;

    const srcFile = resolve(cwd, answers.srcFile);
    const ext = extname(srcFile);
    const isHunspell = hunspellExtensions.includes(ext);
    const srcFiles = isHunspell
        ? hunspellExtensions.map((e) => join(dirname(srcFile), basename(srcFile, ext) + e))
        : [srcFile];

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
    for (const file of srcFiles.filter((f) => existsSync(f))) {
        copyFileSync(file, created(join('src', basename(file))));
    }
    if (!existsSync(join(packageDir, values.srcFile))) {
        console.log(`Source file not found: ${srcFile}\nCreating an empty file.`);
        write(values.srcFile, `# ${title(friendlyName)} Terms\n`);
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

function validateName(name: string): string | true {
    if (!name) return 'missing. Give the package directory name, such as en_AU or ruby.';
    if (!/^[\w-]+$/.test(name)) return `"${name}" can only have letters, digits, "_", and "-".`;
    if (existsSync(join(dictionariesDir, name))) return `dictionaries/${name} already exists. Choose another name.`;
    return true;
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
