import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, describe, it } from 'node:test';

import { readDictionary, saveSamples } from './samples-folder.mts';

let root = '';

before(() => {
    root = mkdtempSync(join(tmpdir(), 'create-dictionary-samples-folder-'));
    const dir = join(root, 'de_AR');
    mkdirSync(join(dir, 'samples'), { recursive: true });
    const ext = {
        name: 'German (Argentina)',
        languageSettings: [{ languageId: '*', locale: 'de-AR', dictionaries: ['de-ar'] }],
    };
    writeFileSync(join(dir, 'cspell-ext.json'), '// cSpell Settings\n' + JSON.stringify(ext));
    writeFileSync(join(dir, 'samples', 'README.md'), '# German (Argentina) Samples\n\n- `seattle.md`: Wikipedia.');
    writeFileSync(join(dir, 'samples', 'seattle.md'), '# Seattle\n');
    writeFileSync(join(root, 'notes.md'), 'Ein Text.\n');
});

after(() => rmSync(root, { recursive: true, force: true }));

describe('readDictionary', () => {
    it("reads the name, locale, and file types from cspell-ext.json, and what's in samples/", async () => {
        assert.deepEqual(await readDictionary(join(root, 'de_AR')), {
            title: 'German (Argentina)',
            locale: 'de-AR',
            languageId: '*',
            samples: ['README.md', 'seattle.md'],
        });
    });

    it("refuses a folder that isn't a dictionary", async () => {
        await assert.rejects(readDictionary(root), /no cspell-ext\.json here/);
    });
});

describe('saveSamples', () => {
    const added = new Date().toISOString().slice(0, 10);

    it('writes the samples, lists them in sample-sources.csv, and adds the table to the README', () => {
        const dir = join(root, 'de_AR');
        saveSamples(dir, 'German (Argentina)', [
            { name: 'notes.md', from: join(root, 'notes.md'), origin: 'my notes', license: 'MIT' },
            { name: 'berlin.md', text: '# Berlin\n' },
        ]);
        assert.equal(readFileSync(join(dir, 'samples', 'notes.md'), 'utf8'), 'Ein Text.\n');
        assert.equal(readFileSync(join(dir, 'samples', 'berlin.md'), 'utf8'), '# Berlin\n');
        assert.equal(
            readFileSync(join(dir, 'samples', 'sample-sources.csv'), 'utf8'),
            'File,Source,Added,License\n' +
                `[notes.md](./notes.md),my notes,${added},MIT\n` +
                `[berlin.md](./berlin.md),unknown,${added},unknown\n`,
        );
        const readme = readFileSync(join(dir, 'samples', 'README.md'), 'utf8');
        assert.ok(
            readme.startsWith(
                '# German (Argentina) Samples\n\n- `seattle.md`: Wikipedia.\n\n<!--- @@inject: sample-sources.csv#markdown --->\n',
            ),
        );
        assert.match(readme, /\| \[berlin\.md\]\(\.\/berlin\.md\) +\| unknown +\|/);
    });

    it('adds to sample-sources.csv, and refreshes the table', () => {
        const dir = join(root, 'de_AR');
        saveSamples(dir, 'German (Argentina)', [{ name: 'hamburg.md', text: '# Hamburg\n', origin: 'a test' }]);
        const csv = readFileSync(join(dir, 'samples', 'sample-sources.csv'), 'utf8');
        assert.match(csv, /\n\[hamburg\.md\]\(\.\/hamburg\.md\),a test,/);
        const readme = readFileSync(join(dir, 'samples', 'README.md'), 'utf8');
        assert.equal(readme.match(/@@inject: /g)?.length, 1);
        assert.match(readme, /\| \[hamburg\.md\]/);
    });

    it('starts a README when there is none', () => {
        const dir = join(root, 'new');
        saveSamples(dir, 'Ruby', [{ name: 'hello.rb', text: 'puts 1\n', origin: 'https://example.com/ruby' }]);
        const readme = readFileSync(join(dir, 'samples', 'README.md'), 'utf8');
        assert.match(readme, /^# Ruby Samples\n/);
        assert.match(readme, /\| \[hello\.rb\]\(\.\/hello\.rb\) +\| <https:\/\/example\.com\/ruby> +\|/);
    });
});
