import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, describe, it } from 'node:test';

import {
    articleOf,
    fetchArticle,
    fetchSeattle,
    languageOf,
    noSampleOptions,
    parseSamples,
    pronunciation,
    samplesConfig,
    samplesExplanation,
    sampleWarnings,
    sampleWords,
    samplesReadme,
} from './samples.mts';

let root = '';

before(() => {
    root = mkdtempSync(join(tmpdir(), 'create-dictionary-samples-'));
    writeFileSync(join(root, 'example.rb'), 'puts zorbal\n');
    writeFileSync(join(root, 'README.md'), '# Words\n');
    writeFileSync(join(root, 'words.txt'), '# Terms\n\nzorbal\n!forbidden\n*compound*\nC#\nquix-ly\nzorbal\n');
    writeFileSync(
        join(root, 'en_XX.dic'),
        '5\n# A comment\n\tAnother comment\nwalk/G\ntalk\tpo:verb\nwlak/!\npart/c\nthe\n',
    );
    writeFileSync(join(root, 'en_XX.aff'), 'SET UTF-8\nFORBIDDENWORD !\nONLYINCOMPOUND c\nSFX G Y 1\nSFX G 0 ing .\n');
    writeFileSync(join(root, 'many.txt'), Array.from({ length: 100 }, (_, i) => `word${i}`).join('\n'));
});

after(() => rmSync(root, { recursive: true, force: true }));

describe('parseSamples', () => {
    it('takes each sample with its origin, by its file name', () => {
        const samples = parseSamples(
            { ...noSampleOptions, addSample: ['example.rb'], addSampleOrigin: ['example.rb=https://example.com/ruby'] },
            root,
        );
        assert.deepEqual(samples, [
            { name: 'example.rb', from: join(root, 'example.rb'), origin: 'https://example.com/ruby' },
        ]);
    });

    it('refuses a missing file, a name create-dictionary writes, and an origin for no sample', () => {
        assert.throws(() => parseSamples({ ...noSampleOptions, addSample: ['gone.rb'] }, root), /gone\.rb not found/);
        assert.throws(() => parseSamples({ ...noSampleOptions, addSample: ['README.md'] }, root), /written by/);
        assert.throws(
            () => parseSamples({ ...noSampleOptions, addSampleOrigin: ['example.rb=somewhere'] }, root),
            /no sample is named example\.rb/,
        );
    });
});

describe('sampleWarnings', () => {
    it('says why samples matter, and suggests Seattle for a natural language', () => {
        assert.match(sampleWarnings([], '*')[0], /no samples/);
        assert.match(sampleWarnings([], 'nl-NL')[0], /https:\/\/nl\.wikipedia\.org\/w\/index\.php\?search=Seattle/);
        assert.match(sampleWarnings([{ name: 'example.rb' }], '*')[0], /example\.rb has no origin/);
    });
});

describe('languageOf', () => {
    it('uses the first locale, and nothing for any language', () => {
        assert.equal(languageOf('en_AU,en'), 'en');
        assert.equal(languageOf('*'), undefined);
    });
});

describe('articleOf', () => {
    it('takes the language and title from a link, and the dictionary language for a title', () => {
        assert.deepEqual(articleOf('https://de.wikipedia.org/wiki/Brandenburger_Tor', 'en'), {
            language: 'de',
            title: 'Brandenburger Tor',
        });
        assert.deepEqual(articleOf(' Berlin ', 'de'), { language: 'de', title: 'Berlin' });
    });
});

describe('fetchArticle', () => {
    // A Wikipedia where German has Berlin, and Hebrew has Seattle only under its Hebrew title.
    const wikipedia = async (url: string) => {
        const title = decodeURIComponent(/titles=([^&]+)/.exec(url)?.[1] ?? '');
        if (url.includes('prop=langlinks')) {
            const langlink = title === 'Argentina' ? 'Argentinien' : 'סיאטל';
            return { query: { pages: [{ langlinks: [{ title: langlink }] }] } };
        }
        if (url.startsWith('https://de.') && title === 'Argentina') {
            const pageprops = { disambiguation: '' };
            return { query: { pages: [{ title: 'Argentina', extract: 'Argentina steht für:', pageprops }] } };
        }
        if (url.startsWith('https://de.') && title === 'Argentinien') {
            return { query: { pages: [{ title: 'Argentinien', extract: 'Argentinien ist ein Staat.' }] } };
        }
        if (url.startsWith('https://de.') && title === 'Berlin') {
            return { query: { pages: [{ title: 'Berlin', extract: 'Berlin ist die Hauptstadt.' }] } };
        }
        if (url.startsWith('https://he.') && title === 'סיאטל') {
            return { query: { pages: [{ title: 'סיאטל', extract: 'סיאטל היא עיר.\nהיא גדולה.' }] } };
        }
        return { query: { pages: [{ missing: true }] } };
    };

    it('fetches the lead of an article by its title, named after it', async () => {
        const sample = await fetchArticle({ language: 'de', title: 'Berlin' }, wikipedia);
        assert.equal(sample?.name, 'berlin.md');
        assert.equal(sample?.text, '# [Berlin](https://de.wikipedia.org/wiki/Berlin)\n\nBerlin ist die Hauptstadt.\n');
        assert.match(
            sample?.origin ?? '',
            /^https:\/\/de\.wikipedia\.org\/wiki\/Berlin, the start of the article, fetched \d{4}-\d{2}-\d{2}$/,
        );
    });

    it('finds an English title in the language, such as Seattle in Hebrew', async () => {
        const sample = await fetchSeattle('he', wikipedia);
        assert.equal(sample?.name, 'seattle.md');
        const url = 'https://he.wikipedia.org/wiki/' + encodeURIComponent('סיאטל');
        assert.equal(sample?.text, `# [סיאטל](${url})\n\nסיאטל היא עיר.\n\nהיא גדולה.\n`);
    });

    it('skips a disambiguation page, and tries the English title', async () => {
        const sample = await fetchArticle({ language: 'de', title: 'Argentina' }, wikipedia);
        assert.equal(sample?.name, 'argentina.md');
        assert.match(sample?.text ?? '', /^# \[Argentinien\]/);
    });

    it('gives nothing, without failing, when there is no network or no such article', async () => {
        const offline = async () => {
            throw new Error('offline');
        };
        assert.equal(await fetchArticle({ language: 'de', title: 'Berlin' }, offline), undefined);
        assert.equal(await fetchArticle({ language: 'de', title: 'Nowhere' }, wikipedia), undefined);
    });
});

describe('samplesReadme', () => {
    it('lists each sample with its origin, or no known origin', () => {
        const readme = samplesReadme('Ruby', [{ name: 'example.rb' }]);
        assert.match(readme, /^# Ruby Samples\n/);
        assert.match(readme, /`example\.rb`: no known origin\./);
    });
});

describe('sampleWords', () => {
    it('takes plain words, each once, skipping comments and entries with markers', async () => {
        assert.deepEqual(await sampleWords([join(root, 'words.txt')]), ['zorbal', 'quix-ly']);
    });

    it('takes the stems of a Hunspell .dic file, without comments, forbidden words, or compound parts', async () => {
        assert.deepEqual(await sampleWords([join(root, 'en_XX.dic')]), ['walk', 'talk', 'the']);
    });

    it('spreads the words across the sources', async () => {
        assert.deepEqual(await sampleWords([join(root, 'many.txt')], 4), ['word0', 'word25', 'word50', 'word75']);
    });
});

describe('samplesExplanation', () => {
    it('asks for Markdown in the language, for a natural language', () => {
        assert.match(samplesExplanation('de-CH', '*')[0], /^Samples should be Markdown files written in German, /);
    });

    it('asks for files of the file types, for anything else', () => {
        assert.match(
            samplesExplanation('*', 'ruby, erb')[0],
            /^Samples should be ruby or erb files from real projects, /,
        );
    });
});

describe('samplesConfig', () => {
    it("checks a natural language's samples in its language", () => {
        assert.deepEqual(samplesConfig('de-CH', '*'), {
            import: ['../cspell-ext.json'],
            ignorePaths: ['README.md', 'cspell.json'],
            language: 'de-CH,en',
            patterns: [pronunciation],
            ignoreRegExpList: ['pronunciation'],
            words: [],
            overrides: [{ filename: 'sample-words-in-dictionary.txt', language: 'de-CH', languageId: '*' }],
        });
    });

    it('skips pronunciations, but not links or paths', () => {
        const [, body, flags] = /^\/(.*)\/(\w*)$/.exec(pronunciation.pattern) ?? [];
        const text = 'Seattle ([sɪˈætəl]), Paris /pæˈɹɪs/, a [link](x), and /usr/bin/.';
        assert.deepEqual(text.match(new RegExp(body, flags)), ['[sɪˈætəl]', '/pæˈɹɪs/']);
    });

    it('adds no other English to an English dictionary', () => {
        assert.deepEqual((samplesConfig('en-AU', '*') as { language: string }).language, 'en-AU');
    });

    it('leaves the language to cspell for other dictionaries', () => {
        assert.equal('language' in samplesConfig('*', 'ruby'), false);
    });
});
