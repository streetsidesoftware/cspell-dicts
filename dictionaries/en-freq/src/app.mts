import { Command, program as defaultCommand } from 'commander';
import { loadWordFreqCollection } from './index.js';

export async function app(program = defaultCommand): Promise<Command> {
    program.name('en-freq').description('English Word Frequency Helper.').addCommand(commandLookUp());

    program.showHelpAfterError();
    return program;
}

function commandLookUp(): Command {
    interface Options {
        output?: string;
    }

    const command = new Command('lookup')
        .description('Lookup English Words')
        .arguments('<words...>')
        .action(async (words: string[], _options: unknown) => {
            const collection = await loadWordFreqCollection();
            const data = words.flatMap((word): { word: string; found: string; freq: number | string }[] => {
                const found = collection.search(word);
                if (!found) {
                    return [{ word, found: 'N/A', freq: 'N/A' }];
                }
                return found.map(([found, freq]) => ({ word, found, freq }));
            });
            console.table(data);
        });

    return command;
}

export async function run(argv?: string[], program?: Command): Promise<void> {
    const prog = await app(program);
    await prog.parseAsync(argv);
}
