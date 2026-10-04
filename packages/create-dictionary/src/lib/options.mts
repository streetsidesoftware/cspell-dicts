import { Command, Option } from 'commander';

export interface Answers {
    name?: string;
    friendlyName?: string;
    description?: string;
    packageDescription?: string;
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
    /** Create an empty word list if the source is missing. */
    allowMissingSource: boolean;
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
    srcFiles: '<source>, --source, or --allow-missing-source',
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
    source?: string[];
    locale?: string;
    languageId?: string;
    trie?: boolean;
    build?: boolean;
    allowMissingSource?: boolean;
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
            '--source <file>',
            'a .txt word list or Hunspell .dic file, copied to src/; repeat it for several',
            (value: string, previous: string[] = []) => [...previous, value],
        )
        .option(
            '--allow-missing-source',
            'if the source is missing, create an empty word list (src/<name>.txt without --source); not for Hunspell files',
        )
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
        srcFiles: combine(sourceArgs, opts.source ?? []),
        locale: opts.locale,
        languageId: opts.languageId,
        useTrie: opts.trie,
        doBuild: opts.build,
    };

    return {
        answers,
        yes: !!opts.yes,
        allowMissingSource: !!opts.allowMissingSource,
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
