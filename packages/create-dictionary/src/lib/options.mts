import { Command, Option } from 'commander';

import type { SourceOptions } from './sources.mts';

export interface Answers {
    name?: string;
    friendlyName?: string;
    description?: string;
    packageDescription?: string;
    contributors?: string[];
    keywords?: string[];
    srcFiles?: string[];
    locale?: string;
    languageId?: string;
    useTrie?: boolean;
    doBuild?: boolean;
}

export interface CommandLine {
    answers: Answers;
    /** Use the defaults for anything not given, and never prompt. */
    yes: boolean;
    /** Start a missing word list, or src/<name>.txt when there's no source, as an empty placeholder. */
    placeholderWordLists: boolean;
    /** The --define-source and --add-source-* options, as given. */
    sourceOptions: SourceOptions;
    /** Create src/additional_words.txt. */
    additionalWords: boolean;
    /** Create src/exclude_words.txt. */
    excludeWords: boolean;
    /** The repo to create the dictionary in. */
    root?: string;
    /** Don't run `pnpm install` in the new dictionary. */
    skipInstall: boolean;
}

/** The option that answers each prompt, for error messages. */
export const optionForAnswer: Record<keyof Answers, string> = {
    name: '<name> or --name',
    friendlyName: '--friendly-name',
    description: '--description',
    packageDescription: '--package-description',
    contributors: '--contributor',
    keywords: '--keyword',
    srcFiles: '<source>, --source, or --placeholder-word-lists',
    locale: '--locale',
    languageId: '--language-id',
    useTrie: '--trie or --no-trie',
    doBuild: '--build or --no-build',
};

interface Options {
    name?: string;
    friendlyName?: string;
    description?: string;
    packageDescription?: string;
    contributor?: string[];
    keyword?: string[];
    source?: string[];
    locale?: string;
    languageId?: string;
    trie?: boolean;
    build?: boolean;
    placeholderWordLists?: boolean;
    additionalWords?: boolean;
    excludeWords?: boolean;
    defineSource?: string[];
    addSourceFile?: string[];
    addSourceLicense?: string[];
    addSourceReadme?: string[];
    addSourceUrl?: string[];
    root?: string;
    skipInstall?: boolean;
    yes?: boolean;
}

export function parseCommandLine(argv: string[]): CommandLine {
    const program = new Command()
        .name('create-dictionary')
        .description(
            'Create a dictionary package in dictionaries/<name>/.\n' +
                'It prompts for anything not given as an option. With --yes, it uses the defaults instead and never prompts.',
        )
        .argument('[name]', 'the directory name for the dictionary, such as en_AU or ruby (same as --name)')
        .argument('[sources...]', 'the source word lists or Hunspell .dic files (same as --source)')
        .option('--name <name>', 'the directory name for the dictionary, such as en_AU or ruby')
        .option('--friendly-name <text>', 'a readable name, such as "Australian English"; default: from the name')
        .option(
            '--description <text>',
            'what words it covers, such as "Ruby keywords and standard library names"; required',
        )
        .option(
            '--package-description <text>',
            'the description npm shows; default: "<Friendly name> dictionary for cspell."',
        )
        .option(
            '--contributor <person>',
            'someone who created or maintains the dictionary: "Name", "Name <email>", or "Name (url)"; repeat it for several',
            (value: string, previous: string[] = []) => [...previous, value],
        )
        .option(
            '--keyword <word>',
            'another name people search npm for, such as golang for Go; repeat it for several',
            (value: string, previous: string[] = []) => [...previous, value],
        )
        .option(
            '--source <file>',
            'a .txt word list or Hunspell .dic file, copied to src/; repeat it for several',
            (value: string, previous: string[] = []) => [...previous, value],
        )
        .option(
            '--placeholder-word-lists',
            'start a missing word list empty, or src/<name>.txt without a source; Hunspell and third-party files must exist',
        )
        .option(
            '--define-source <[name=]path>',
            'a third-party source: a folder copied into src/<name>/; repeatable',
            (value: string, previous: string[] = []) => [...previous, value],
        )
        .option(
            '--add-source-file <name[/local]=path>',
            'a word list or Hunspell file of a source, relative to it; repeatable',
            (value: string, previous: string[] = []) => [...previous, value],
        )
        .option(
            '--add-source-license <name[/local]=path>',
            "a source's license, published with the dictionary",
            (value: string, previous: string[] = []) => [...previous, value],
        )
        .option(
            '--add-source-readme <name[/local]=path>',
            "a source's README, published with the dictionary",
            (value: string, previous: string[] = []) => [...previous, value],
        )
        .option(
            '--add-source-url <name=url>',
            'where a source can be found',
            (value: string, previous: string[] = []) => [...previous, value],
        )
        .option('--no-additional-words', 'do not create src/additional_words.txt, for words the sources lack')
        .option('--no-exclude-words', 'do not create src/exclude_words.txt, for words to leave out of the build')
        .option('--locale <locales>', 'locales, comma separated, such as "en,en-AU", or "*" for any; default: "*"')
        .option(
            '--language-id <ids>',
            'file types, comma separated, such as "ruby", or "*" for any; default: "*". Give this or --locale: both "*" is an error',
        )
        .option('--trie', 'store as a trie; default for Hunspell .dic and .aff sources')
        .option('--no-trie', 'store as plain text; default for other sources')
        .option('--build', 'build the dictionary after creating it; default for existing Hunspell sources')
        .option('--no-build', 'do not build it')
        // For the tests; see the package's README.
        .addOption(new Option('--root <dir>', 'the repo to create the dictionary in').hideHelp())
        .addOption(new Option('--skip-install', 'do not run pnpm install in the new dictionary').hideHelp())
        .option('-y, --yes', 'use the defaults for anything not given, and never prompt')
        .addHelpText(
            'after',
            [
                '',
                'Examples:',
                '  pnpm create-dictionary',
                '  pnpm create-dictionary --yes ruby ./ruby-words.txt --friendly-name Ruby --language-id ruby --no-build \\',
                '    --description "Ruby keywords and standard library names"',
            ].join('\n'),
        );

    program.parse(argv, { from: 'user' });

    const [nameArg, ...sourceArgs] = program.args;
    const opts = program.opts<Options>();

    const answers: Answers = {
        name: oneOf('name', nameArg, opts.name),
        friendlyName: opts.friendlyName,
        description: opts.description,
        packageDescription: opts.packageDescription,
        contributors: opts.contributor,
        keywords: opts.keyword,
        srcFiles: combine(sourceArgs, opts.source ?? []),
        locale: opts.locale,
        languageId: opts.languageId,
        useTrie: opts.trie,
        doBuild: opts.build,
    };

    return {
        answers,
        yes: !!opts.yes,
        placeholderWordLists: !!opts.placeholderWordLists,
        sourceOptions: {
            defineSource: opts.defineSource ?? [],
            addSourceFile: opts.addSourceFile ?? [],
            addSourceLicense: opts.addSourceLicense ?? [],
            addSourceReadme: opts.addSourceReadme ?? [],
            addSourceUrl: opts.addSourceUrl ?? [],
        },
        additionalWords: opts.additionalWords !== false,
        excludeWords: opts.excludeWords !== false,
        root: opts.root,
        skipInstall: !!opts.skipInstall,
    };

    /** Sources given positionally and as --source, in order, each once. */
    function combine(args: string[], options: string[]): string[] | undefined {
        const all = [...new Set([...args, ...options])];
        return all.length ? all : undefined;
    }

    function oneOf(name: string, arg: string | undefined, option: string | undefined): string | undefined {
        if (arg !== undefined && option !== undefined && arg !== option) {
            program.error(`error: the ${name} is given twice, as "${arg}" and --${name} "${option}"`);
        }
        return option ?? arg;
    }
}
