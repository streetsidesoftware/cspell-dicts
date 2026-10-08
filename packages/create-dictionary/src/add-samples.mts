#!/usr/bin/env node

// Adds samples to the dictionary package in the current folder. Run with --help for usage.

import { confirm, input } from '@inquirer/prompts';
import { Command } from 'commander';

import { gatherSamples } from './lib/gather-samples.mts';
import { explain, fail, info, literal, stopped } from './lib/output.mts';
import { readDictionary, saveSamples } from './lib/samples-folder.mts';
import { samplesExplanation } from './lib/samples.mts';

async function main(): Promise<void> {
    const program = new Command()
        .name('add-samples')
        .description(
            'Add samples to the dictionary in this folder: files copied into samples/, and listed in samples/sample-sources.csv.\n' +
                'It prompts for them when no option is given.',
        )
        .option(
            '--add-sample <path>',
            'a real file of the kind the dictionary is for; repeatable',
            (value: string, previous: string[] = []) => [...previous, value],
        )
        .option(
            '--add-sample-origin <file=origin>',
            'where a sample came from, a URL or a few words, by its file name; repeatable',
            (value: string, previous: string[] = []) => [...previous, value],
        )
        .option(
            '--add-sample-license <file=license>',
            'the license of a sample, such as MIT, by its file name; repeatable',
            (value: string, previous: string[] = []) => [...previous, value],
        )
        .option(
            '--add-wikipedia-sample <title or URL>',
            'for a natural language, the start of a Wikipedia article in its language, such as Berlin or a wikipedia.org link; repeatable',
            (value: string, previous: string[] = []) => [...previous, value],
        )
        .helpOption('-h, --help', 'show this help')
        .addHelpText(
            'after',
            ['', 'Examples:', '  pnpm exec add-samples', '  pnpm exec add-samples --add-wikipedia-sample Berlin'].join(
                '\n',
            ),
        )
        .parse();
    const opts = program.opts<{
        addSample?: string[];
        addSampleOrigin?: string[];
        addSampleLicense?: string[];
        addWikipediaSample?: string[];
    }>();
    const options = {
        addSample: opts.addSample ?? [],
        addSampleOrigin: opts.addSampleOrigin ?? [],
        addSampleLicense: opts.addSampleLicense ?? [],
        addWikipediaSample: opts.addWikipediaSample ?? [],
    };
    const prompt = !options.addSample.length && !options.addWikipediaSample.length;
    if (prompt && !process.stdin.isTTY) {
        throw new Error('No terminal to prompt in. Give --add-sample or --add-wikipedia-sample.');
    }

    const dir = process.cwd();
    const dictionary = await readDictionary(dir);
    if (prompt) explain(...samplesExplanation(dictionary.locale, dictionary.languageId));
    const samples = await gatherSamples(options, {
        locale: dictionary.locale,
        cwd: dir,
        existing: dictionary.samples,
        prompt,
        seattle: prompt,
        ask: { input, confirm },
        info,
    });
    if (!samples.length) {
        info('No samples added.');
        return;
    }
    await saveSamples(dir, dictionary.title, samples);
    info('\nRun %s to check them.', literal('pnpm test'));
}

try {
    await main();
} catch (e) {
    // Ctrl+C at a prompt.
    if (e instanceof Error && e.name === 'ExitPromptError') stopped();
    else fail(e instanceof Error ? e.message : String(e));
    process.exitCode = 1;
}
