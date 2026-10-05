import { spawnSync } from 'node:child_process';
import { appendFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { readConfigFile } from 'cspell-lib';

import { created } from './output.mts';
import {
    type Sample,
    sampleContent,
    sampleSources,
    samplesReadme,
    sourcesHeader,
    sourcesMarker,
    sourcesRow,
} from './samples.mts';

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

/**
 * Writes the samples into `dir/samples/`, adds them to `sample-sources.csv`, and shows that as a table in its
 * `README.md`. Starts the README, and adds the table's marker to it, when missing. Paths are shown relative to `base`.
 */
export function saveSamples(dir: string, title: string, samples: Sample[], base = dir): void {
    const samplesDir = join(dir, 'samples');
    mkdirSync(samplesDir, { recursive: true });
    const write = (file: string, content: Buffer | string) => {
        const path = join(samplesDir, file);
        writeFileSync(path, content);
        created(relative(base, path));
    };
    for (const sample of samples) write(sample.name, sampleContent(sample));

    const added = new Date().toISOString().slice(0, 10);
    const rows = samples.map((sample) => sourcesRow(sample, added) + '\n').join('');
    const csv = join(samplesDir, sampleSources);
    if (existsSync(csv)) appendFileSync(csv, withNewline(readFileSync(csv, 'utf8')) + rows);
    else write(sampleSources, sourcesHeader + '\n' + rows);

    const readme = join(samplesDir, 'README.md');
    if (!existsSync(readme)) write('README.md', samplesReadme(title));
    const current = readFileSync(readme, 'utf8');
    if (!current.includes(`@@inject: ${sampleSources}`)) {
        appendFileSync(readme, withNewline(current) + '\n' + sourcesMarker + '\n');
    }
    injectSources(samplesDir);
}

/** A newline, if `text` doesn't end with one, so what's appended starts on a line of its own. */
function withNewline(text: string): string {
    return text && !text.endsWith('\n') ? '\n' : '';
}

/** Refreshes the sources table in `samples/README.md`. */
function injectSources(samplesDir: string): void {
    const bin = fileURLToPath(import.meta.resolve('inject-markdown/bin'));
    const result = spawnSync(process.execPath, [bin, '--silent', 'README.md'], { cwd: samplesDir, encoding: 'utf8' });
    if (result.status !== 0) throw new Error(`couldn't update samples/README.md: ${result.stderr || result.stdout}`);
}
