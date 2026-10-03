import { Command } from 'commander';

export interface Answers {
    name?: string;
    friendlyName?: string;
    description?: string;
    srcFile?: string;
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
}

/** The option that answers each prompt, for error messages. */
export const optionForAnswer: Record<keyof Answers, string> = {
    name: '<name> or --name',
    friendlyName: '--friendly-name',
    description: '--description',
    srcFile: '<source>, --source, or --allow-missing-source',
    locale: '--locale',
    languageId: '--language-id',
    useTrie: '--trie or --no-trie',
    doBuild: '--build or --no-build',
};

interface Options {
    name?: string;
    friendlyName?: string;
    description?: string;
    source?: string;
    locale?: string;
    languageId?: string;
    trie?: boolean;
    build?: boolean;
    allowMissingSource?: boolean;
    yes?: boolean;
}

export function parseCommandLine(argv: string[]): CommandLine {
    const program = new Command()
        .name('create-dictionary')
        .description(
            'Create a dictionary package in dictionaries/<name>/.\n' +
                'It prompts for anything not given as an option. With --yes, it uses the defaults instead and never prompts.',
        )
        .argument('[name]', 'the package directory name, such as en_AU or ruby (same as --name)')
        .argument('[source]', 'the source word list or Hunspell .dic file (same as --source)')
        .option('--name <name>', 'the package directory name, such as en_AU or ruby')
        .option('--friendly-name <text>', 'a readable name, such as "Australian English"; default: from the name')
        .option('--description <text>', 'a short description; default: "<Friendly name> dictionary for cspell."')
        .option('--source <file>', 'the .txt word list or Hunspell .dic file, copied to src/')
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
        .option('-y, --yes', 'use the defaults for anything not given, and never prompt')
        .addHelpText(
            'after',
            [
                '',
                'Examples:',
                '  pnpm create-dictionary',
                '  pnpm create-dictionary --yes ruby ./ruby-words.txt --friendly-name Ruby --language-id ruby --no-build',
            ].join('\n'),
        );

    program.parse(argv, { from: 'user' });

    const [nameArg, sourceArg] = program.args;
    const opts = program.opts<Options>();

    const answers: Answers = {
        name: oneOf('name', nameArg, opts.name),
        friendlyName: opts.friendlyName,
        description: opts.description,
        srcFile: oneOf('source', sourceArg, opts.source),
        locale: opts.locale,
        languageId: opts.languageId,
        useTrie: opts.trie,
        doBuild: opts.build,
    };

    return { answers, yes: !!opts.yes, allowMissingSource: !!opts.allowMissingSource };

    function oneOf(name: string, arg: string | undefined, option: string | undefined): string | undefined {
        if (arg !== undefined && option !== undefined && arg !== option) {
            program.error(`error: the ${name} is given twice, as "${arg}" and --${name} "${option}"`);
        }
        return option ?? arg;
    }
}
