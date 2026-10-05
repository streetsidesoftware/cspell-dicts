import type { confirm, input } from '@inquirer/prompts';

import { localeName } from './locales.mts';
import { literal } from './output.mts';
import {
    addSample,
    articleOf,
    checkSample,
    fetchArticle,
    languageOf,
    parseSamples,
    type Sample,
    type SampleOptions,
} from './samples.mts';

export interface Gathering {
    /** The dictionary's locales, such as `de-AR`, or `*`. */
    locale: string;
    /** Where sample paths are relative to. */
    cwd: string;
    /** The names already in `samples/`, which new samples can't take. */
    existing?: string[];
    /** Ask for more samples than the options give. */
    prompt: boolean;
    /** Offer the start of the Wikipedia article on Seattle, for a natural language. */
    seattle: boolean;
    ask: { input: typeof input; confirm: typeof confirm };
    info: (format: string, ...values: unknown[]) => void;
}

/** The samples so far, by name, including the names already in `samples/`. */
interface Gathered extends Gathering {
    list: Sample[];
    byName: Map<string, Sample>;
}

/** The samples from the options, the Wikipedia articles for a natural language, then the files from the prompts. */
export async function gatherSamples(options: SampleOptions, gathering: Gathering): Promise<Sample[]> {
    const existing = gathering.existing ?? [];
    const list = parseSamples(options, gathering.cwd, existing);
    const byName = new Map<string, Sample>([
        ...existing.map((name) => [name, { name }] as const),
        ...list.map((sample) => [sample.name, sample] as const),
    ]);
    const gathered: Gathered = { ...gathering, list, byName };
    const language = languageOf(gathering.locale);
    if (language) await wikipediaSamples(options.addWikipediaSample, language, gathered);
    if (gathering.prompt) await sampleFiles(gathered);
    return list;
}

/** The article on Seattle, unless declined or already there, the articles given as options, then those asked for. */
async function wikipediaSamples(titlesOrUrls: string[], language: string, gathered: Gathered): Promise<void> {
    const { prompt, ask } = gathered;
    if (gathered.seattle && !gathered.byName.has('seattle.md')) {
        const languageName = localeName(language) ?? language;
        const message = `Fetch the start of the Wikipedia article on Seattle, in ${languageName}, as a sample?`;
        if (!prompt || (await ask.confirm({ message, default: true }))) await addArticle('Seattle', language, gathered);
    }
    for (const titleOrUrl of titlesOrUrls) await addArticle(titleOrUrl, language, gathered);
    if (!prompt) return;
    for await (const titleOrUrl of untilEmpty(ask, {
        message: 'Wikipedia article, by title or link; empty to finish:',
    })) {
        await addArticle(titleOrUrl, language, gathered);
    }
}

/** Fetches an article into the samples. Without a network, or such an article, it says so and goes on. */
async function addArticle(titleOrUrl: string, language: string, { list, byName, info }: Gathered): Promise<void> {
    const article = articleOf(titleOrUrl, language);
    const sample = await fetchArticle(article);
    if (!sample) {
        const languageName = localeName(article.language) ?? article.language;
        info("Couldn't fetch the Wikipedia article %s in %s.", literal(article.title), languageName);
    } else if (byName.has(sample.name)) {
        info('There is already a sample named %s.', literal(sample.name));
    } else {
        byName.set(sample.name, sample);
        list.push(sample);
        info('Fetched the Wikipedia article %s.', literal(article.title));
    }
}

/** Sample files, each with its source and license, until the path is empty. */
async function sampleFiles({ list, byName, cwd, ask }: Gathered): Promise<void> {
    const validate = (path: string) => !path.trim() || checkSample(byName, path.trim(), cwd);
    for await (const path of untilEmpty(ask, { message: 'Sample file path; empty to finish:', validate })) {
        const sample = addSample(byName, path, cwd);
        const origin = await ask.input({ message: 'Where it came from, a URL or a few words; empty if unknown:' });
        if (origin.trim()) sample.origin = origin.trim();
        const license = await ask.input({ message: 'Its license, such as MIT; empty if unknown:' });
        if (license.trim()) sample.license = license.trim();
        list.push(sample);
    }
}

/** Asks the same question until the answer is empty, and yields each answer, trimmed. */
async function* untilEmpty(ask: Gathering['ask'], config: Parameters<typeof input>[0]): AsyncGenerator<string> {
    for (;;) {
        const answer = (await ask.input(config)).trim();
        if (!answer) return;
        yield answer;
    }
}
