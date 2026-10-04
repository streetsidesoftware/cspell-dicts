import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { fillTemplate } from './template.mts';

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

    it('leaves a value as it is with <%- %>', () => {
        assert.equal(fillTemplate('name: <%- name %>', values, '.yaml'), 'name: Q "Quoted" it\'s');
    });

    it('fails on an unknown value', () => {
        assert.throws(() => fillTemplate('<%= missing %>', values, '.md'), /Unknown template value: missing/);
    });
});
