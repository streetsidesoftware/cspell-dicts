import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { kindFromOptions, localeGivenByName, usesLanguageSettings } from './enabling.mts';

describe('localeGivenByName', () => {
    it('takes the locale of a whole name', () => {
        assert.equal(localeGivenByName('en_AU', {}), 'en-AU');
        assert.equal(localeGivenByName('german', {}), 'de');
        assert.equal(localeGivenByName('en_IN', { languageId: '*' }), 'en-IN');
    });

    it('gives none for any other name', () => {
        assert.equal(localeGivenByName('it-terms', {}), undefined);
        assert.equal(localeGivenByName('en_GB-legacy', {}), undefined);
    });

    it('gives none when an option says otherwise', () => {
        assert.equal(localeGivenByName('en_IN', { locale: 'de' }), undefined);
        assert.equal(localeGivenByName('en_IN', { locale: '*' }), undefined);
        assert.equal(localeGivenByName('en_IN', { languageId: 'erlang' }), undefined);
    });
});

describe('usesLanguageSettings', () => {
    it('uses them for a given value, including a typed "*"', () => {
        assert.equal(usesLanguageSettings({ locale: 'de' }, undefined, true), true);
        assert.equal(usesLanguageSettings({ languageId: 'ruby' }, undefined, true), true);
        assert.equal(usesLanguageSettings({ locale: '*' }, undefined, true), true);
        assert.equal(usesLanguageSettings({ languageId: '*' }, undefined, true), true);
    });

    it('uses them for a locale from the name', () => {
        assert.equal(usesLanguageSettings({}, 'en-AU', true), true);
    });

    it('asks at the prompts, and leaves them out without prompts', () => {
        assert.equal(usesLanguageSettings({}, undefined, false), true);
        assert.equal(usesLanguageSettings({}, undefined, true), false);
    });
});

describe('kindFromOptions', () => {
    it('is a natural language for a locale', () => {
        assert.equal(kindFromOptions({ locale: 'de' }, undefined), 'language');
        assert.equal(kindFromOptions({}, 'en-AU'), 'language');
        assert.equal(kindFromOptions({ locale: 'de', languageId: 'ruby' }, undefined), 'language');
    });

    it('is file types for a file type, or a locale typed as "*"', () => {
        assert.equal(kindFromOptions({ languageId: 'ruby' }, undefined), 'files');
        assert.equal(kindFromOptions({ locale: '*' }, undefined), 'files');
    });

    it('is open otherwise', () => {
        assert.equal(kindFromOptions({}, undefined), undefined);
        assert.equal(kindFromOptions({ languageId: '*' }, undefined), undefined);
    });
});
