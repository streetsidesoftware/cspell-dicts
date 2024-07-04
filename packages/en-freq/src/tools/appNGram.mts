import fs from 'node:fs/promises';
import path from 'node:path';

import chalk from 'chalk';
import { Command, Option, program as defaultCommand } from 'commander';

import { downloadNGrams, fetchTotals } from './fetch-n-gram.mjs';

export async function app(program = defaultCommand): Promise<Command> {
    program
        .name('N-Gram Helper')
        .description('Run performance tests.')
        .addCommand(commandDownload())
        .addCommand(commandDownloadTotals());

    program.showHelpAfterError();
    return program;
}

function commandDownloadTotals(): Command {
    interface Options {
        output?: string;
    }

    const defaultOutput = 'ngram/n-gram-totals.json';

    const command = new Command('download-totals')
        .description('Download the N-Gram totals.')
        .option('-o, --output <file>', 'output file', defaultOutput)
        .action(async (/* args, */ options: Options, _commander: Command) => {
            console.log(chalk.green('Downloading N-Gram totals...'));
            const data = await fetchTotals();
            const filename = options.output ?? defaultOutput;
            await fs.mkdir(path.dirname(filename), { recursive: true });
            await fs.writeFile(filename, JSON.stringify(data, null, 2) + '\n');
            console.log(chalk.green('done.'));
        });

    return command;
}

function commandDownload(): Command {
    interface Options {
        output?: string;
        nGram: string;
        all?: boolean;
    }

    const defaultOutput = 'ngram/n-gram.tsv';

    const command = new Command('download')
        .description('Download the N-Gram totals.')
        .arguments('[prefixes...]')
        .option('-o, --output <file>', 'output file', defaultOutput)
        .option('-a, --all', 'download all prefixes')
        .addOption(
            new Option(
                '-n, --ngram <n>',
                'n-gram number. (1 = frequency of individual words, 2 = frequency of word pairs)',
            )
                .default('1')
                .hideHelp(true), // Not ready yet
        )
        .action(async (prefixes, options: Options, _commander: Command) => {
            console.log(chalk.green('Downloading N-Gram ...'));
            const baseFilename = options.output ?? defaultOutput;
            if (!prefixes.length && !options.all) {
                console.log(chalk.red('No prefixes specified.'));
                return;
            }
            const nGram = Number.parseInt(options.nGram || '1', 10) || 1;
            for await (const file of downloadNGrams(options.all ? {} : { prefixes })) {
                console.log('Saving %s...', file.prefix);
                const filename = calcFilename(baseFilename, nGram, file.prefix);
                await fs.mkdir(path.dirname(filename), { recursive: true });
                await fs.writeFile(filename, file.lines);
            }
            console.log(chalk.green('done.'));
        });

    return command;

    function calcFilename(baseFilename: string, n: number, prefix: string): string {
        const ext = path.extname(baseFilename) || '.tsv';
        const filename = path.basename(baseFilename, ext);
        return path.join(path.dirname(baseFilename), `${filename}.${n}.${prefix}${ext}`);
    }
}

export async function run(argv?: string[], program?: Command): Promise<void> {
    const prog = await app(program);
    await prog.parseAsync(argv);
}
