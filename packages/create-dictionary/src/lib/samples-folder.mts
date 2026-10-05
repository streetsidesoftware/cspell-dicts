import { appendFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';

import { readConfigFile } from 'cspell-lib';

import { created } from './output.mts';
import { readmeLine, type Sample, sampleContent } from './samples.mts';

/** What adding samples needs to know about a dictionary package. */
export interface Dictionary {
    /** Its friendly name, such as "German (Argentina)", for a new `samples/README.md`. */
    title: string;
    /** The locales it's enabled for, such as `de-AR`, or `*`. */
    locale: string;
    /** The file types it's enabled for, such as `ruby`, or `*`. */
    languageId: string;
    /** The files already in `samples/`. */
    samples: string[];
}

/** The dictionary package in `dir`, from its `cspell-ext.json`. */
export async function readDictionary(dir: string): Promise<Dictionary> {
    const extFile = join(dir, 'cspell-ext.json');
    if (!existsSync(extFile)) {
        throw new Error("no cspell-ext.json here. Run it in a dictionary's folder, such as dictionaries/en_AU.");
    }
    const { settings } = await readConfigFile(pathToFileURL(extFile));
    const enabled = (settings.languageSettings ?? []).filter((ls) => ls.locale !== '*' || ls.languageId !== '*');
    const listOf = (values: (string | string[] | undefined)[]) =>
        [...new Set(values.flat().flatMap((v) => (v ?? '*').split(',').map((part) => part.trim())))]
            .filter((v) => v && v !== '*')
            .join(',') || '*';
    const samplesDir = join(dir, 'samples');
    return {
        title: settings.name ?? basename(dir),
        locale: listOf(enabled.map((ls) => ls.locale)),
        languageId: listOf(enabled.map((ls) => ls.languageId)),
        samples: existsSync(samplesDir) ? readdirSync(samplesDir) : [],
    };
}

/** Writes the samples into `dir/samples/`, and lists them in its `README.md`. */
export function saveSamples(dir: string, title: string, samples: Sample[]): void {
    const samplesDir = join(dir, 'samples');
    mkdirSync(samplesDir, { recursive: true });
    for (const sample of samples) {
        const file = join(samplesDir, sample.name);
        writeFileSync(file, sampleContent(sample));
        created(relative(dir, file));
    }
    const readme = join(samplesDir, 'README.md');
    const lines = samples.map(readmeLine).join('\n') + '\n';
    if (!existsSync(readme)) {
        writeFileSync(readme, `# ${title} Samples\n\n${lines}`);
        created(relative(dir, readme));
        return;
    }
    const current = readFileSync(readme, 'utf8');
    appendFileSync(readme, (current.endsWith('\n') ? '' : '\n') + lines);
}
