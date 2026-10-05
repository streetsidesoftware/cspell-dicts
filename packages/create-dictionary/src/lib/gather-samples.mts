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

/** The samples from the options, the Wikipedia article on Seattle for a natural language, then from the prompts. */
export async function gatherSamples(options: SampleOptions, gathering: Gathering): Promise<Sample[]> {
    const { locale, cwd, prompt, ask, info } = gathering;
    const list = parseSamples(options, cwd, gathering.existing);
    const byName = new Map([...(gathering.existing ?? []).map((name) => [name, { name }] as const)]);
    for (const sample of list) byName.set(sample.name, sample);
    const language = languageOf(locale);
    if (language) {
        /** Fetches an article into the samples. Without a network, or such an article, it says so and goes on. */
        const addArticle = async (titleOrUrl: string): Promise<boolean> => {
            const article = articleOf(titleOrUrl, language);
            const sample = await fetchArticle(article);
            if (!sample) {
                info(
                    "Couldn't fetch the Wikipedia article %s in %s.",
                    literal(article.title),
                    localeName(article.language) ?? article.language,
                );
                return false;
            }
            if (byName.has(sample.name)) {
                info('There is already a sample named %s.', literal(sample.name));
                return false;
            }
            byName.set(sample.name, sample);
            list.push(sample);
            info('Fetched the Wikipedia article %s.', literal(article.title));
            return true;
        };
        const languageName = localeName(language) ?? language;
        if (gathering.seattle && !byName.has('seattle.md')) {
            const message = `Fetch the start of the Wikipedia article on Seattle, in ${languageName}, as a sample?`;
            if (!prompt || (await ask.confirm({ message, default: true }))) await addArticle('Seattle');
        }
        for (const titleOrUrl of options.addWikipediaSample) await addArticle(titleOrUrl);
        if (prompt) {
            const message = 'Wikipedia article, by title or link; empty to finish:';
            for (;;) {
                const titleOrUrl = (await ask.input({ message })).trim();
                if (!titleOrUrl) break;
                await addArticle(titleOrUrl);
            }
        }
    }
    if (prompt) {
        const another = () => (list.length ? 'Add another sample file?' : 'Add a sample file?');
        while (await ask.confirm({ message: another(), default: !list.length })) {
            const path = await ask.input({ message: 'Its path:', validate: (v) => checkSample(byName, v, cwd) });
            const sample = addSample(byName, path, cwd);
            const origin = await ask.input({
                message: 'Where it came from (URL or a few words); empty if unknown:',
            });
            if (origin.trim()) sample.origin = origin.trim();
            list.push(sample);
        }
    }
    return list;
}
