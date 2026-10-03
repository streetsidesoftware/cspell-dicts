import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { toPackageName } from '../src/lib/package-name.mts';
import { fillTemplate } from '../src/lib/template.mts';

describe('toPackageName', () => {
    it('lowercases and replaces characters other than a-z, 0-9, and "-"', () => {
        assert.equal(toPackageName('en_AU'), 'en-au');
        assert.equal(toPackageName('medical-terms'), 'medical-terms');
        assert.equal(toPackageName('fr_FR_90'), 'fr-fr-90');
    });
});

describe('fillTemplate', () => {
    const values = { name: 'Q "Quoted" it\'s' };

    it('escapes values for JSON', () => {
        const json = fillTemplate('{ "name": "<%= name %>" }', values, '.json');
        assert.deepEqual(JSON.parse(json), { name: values.name });
    });

    it('escapes single quotes for YAML', () => {
        assert.equal(fillTemplate("name: '<%= name %>'", values, '.yaml'), "name: 'Q \"Quoted\" it''s'");
    });

    it('leaves values as they are in other files', () => {
        assert.equal(fillTemplate('# <%= name %>', values, '.md'), '# Q "Quoted" it\'s');
    });

    it('fails on an unknown value', () => {
        assert.throws(() => fillTemplate('<%= missing %>', values, '.md'), /Unknown template value: missing/);
    });
});
