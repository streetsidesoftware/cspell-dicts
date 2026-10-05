import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
    conventionalName,
    findLocales,
    friendlyNameFromLocale,
    localeFromName,
    localeName,
    localeWarnings,
} from './locales.mts';

describe('localeName', () => {
    it('names known locales, with "_" or "-"', () => {
        assert.equal(localeName('en'), 'English');
        assert.equal(localeName('en_AU'), 'Australian English');
        assert.equal(localeName('sr-Latn'), 'Serbian (Latin)');
    });

    it('knows nothing of made-up or malformed locales', () => {
        assert.equal(localeName('xx'), undefined);
        assert.equal(localeName('english'), undefined);
        assert.equal(localeName('fr-90'), undefined);
    });
});

describe('findLocales', () => {
    it('finds a language and its regional variants by name', () => {
        const english = findLocales('English').map(({ locale }) => locale);
        assert.ok(english.includes('en'));
        assert.ok(english.includes('en-AU'));
        assert.deepEqual(
            findLocales('australian english').map(({ locale }) => locale),
            ['en-AU'],
        );
    });

    it("includes each language's main region", () => {
        const german = findLocales('german').map(({ locale }) => locale);
        for (const locale of ['de', 'de-DE', 'de-AT', 'de-CH']) assert.ok(german.includes(locale), locale);
        assert.ok(!findLocales('english').some(({ locale }) => locale === 'en-IN'));
    });

    it('finds names in the language of this machine too', () => {
        const english = findLocales('Englisch', 'de-DE').find(({ locale }) => locale === 'en');
        assert.deepEqual(english, { locale: 'en', name: 'English', ownName: 'Englisch' });
    });

    it('uses current codes, such as he for Hebrew rather than iw', () => {
        assert.deepEqual(
            findLocales('hebrew').map(({ locale }) => locale),
            ['he', 'he-IL'],
        );
    });
});

describe('localeWarnings', () => {
    it('warns about each unknown item, with what its name could mean', () => {
        const warnings = localeWarnings('english, xx, en-US, *');
        assert.equal(warnings.length, 2);
        assert.match(warnings[0], /"english" isn't a known locale\. Did you mean en \(English\), /);
        assert.match(warnings[1], /^locale: "xx" isn't a known locale\.$/);
    });
});

describe('localeFromName', () => {
    it('reads the locale at the start of the name', () => {
        assert.equal(localeFromName('en_AU'), 'en-AU');
        assert.equal(localeFromName('sr_Latn'), 'sr-Latn');
        assert.equal(localeFromName('grc_GR'), 'grc-GR');
        assert.equal(localeFromName('en_GB-legacy'), 'en-GB');
        assert.equal(localeFromName('th_th'), 'th-TH');
    });

    it('reads a language name', () => {
        assert.equal(localeFromName('german'), 'de');
        assert.equal(localeFromName('latin'), 'la');
    });

    it('leaves other names alone, including three-letter words that are language codes', () => {
        for (const name of ['ruby', 'go', 'ada', 'lua', 'medical-terms', 'lorem-ipsum']) {
            assert.equal(localeFromName(name), undefined, name);
        }
    });
});

describe('friendlyNameFromLocale', () => {
    it('names a dictionary whose whole name is a locale', () => {
        assert.equal(friendlyNameFromLocale('en_AU'), 'Australian English');
        assert.equal(friendlyNameFromLocale('german'), 'German');
        assert.equal(friendlyNameFromLocale('en_IN'), 'English (India)');
    });

    it('leaves a name alone when the locale is only part of it', () => {
        assert.equal(friendlyNameFromLocale('en_GB-legacy'), undefined);
        assert.equal(friendlyNameFromLocale('medical-terms'), undefined);
    });
});

describe('conventionalName', () => {
    it('writes a locale with "_", the language in lowercase and the region in uppercase', () => {
        assert.equal(conventionalName('en-au'), 'en_AU');
        assert.equal(conventionalName('EN_au'), 'en_AU');
        assert.equal(conventionalName('sr-latn'), 'sr_Latn');
    });

    it('writes a language name in lowercase', () => {
        assert.equal(conventionalName('German'), 'german');
    });

    it('joins words with "-" and lowercases the rest, except a locale part', () => {
        assert.equal(conventionalName('Medical Terms'), 'medical-terms');
        assert.equal(conventionalName('Rust'), 'rust');
        assert.equal(conventionalName('en_gb-Legacy'), 'en_GB-legacy');
        assert.equal(conventionalName('scientific_terms_gb'), 'scientific_terms_GB');
    });

    it('leaves names that already follow the convention alone', () => {
        for (const name of ['ruby', 'data-science', 'en_GB-legacy', 'en_shared', 'fr_FR_90']) {
            assert.equal(conventionalName(name), name);
        }
    });
});
