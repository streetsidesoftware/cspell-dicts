import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, describe, it } from 'node:test';

import { noSampleOptions, parseSamples, sampleWarnings, sampleWords, samplesReadme, seattle } from './samples.mts';

let root = '';

before(() => {
    root = mkdtempSync(join(tmpdir(), 'create-dictionary-samples-'));
    writeFileSync(join(root, 'example.rb'), 'puts zorbal\n');
    writeFileSync(join(root, 'README.md'), '# Words\n');
    writeFileSync(join(root, 'words.txt'), '# Terms\n\nzorbal\n!forbidden\n*compound*\nC#\nquix-ly\nzorbal\n');
    writeFileSync(join(root, 'en_XX.dic'), '3\nwalk/GD\ntalk\tpo:verb\nthe\n');
});

after(() => rmSync(root, { recursive: true, force: true }));

describe('parseSamples', () => {
    it('takes each sample with its origin, by its file name', () => {
        const samples = parseSamples(
            { addSample: ['example.rb'], addSampleOrigin: ['example.rb=https://example.com/ruby'] },
            root,
        );
        assert.deepEqual(samples, [{ path: join(root, 'example.rb'), origin: 'https://example.com/ruby' }]);
    });

    it('refuses a missing file, a name create-dictionary writes, and an origin for no sample', () => {
        assert.throws(() => parseSamples({ ...noSampleOptions, addSample: ['gone.rb'] }, root), /gone\.rb not found/);
        assert.throws(() => parseSamples({ ...noSampleOptions, addSample: ['README.md'] }, root), /written by/);
        assert.throws(
            () => parseSamples({ addSample: [], addSampleOrigin: ['example.rb=somewhere'] }, root),
            /no sample is named example\.rb/,
        );
    });
});

describe('sampleWarnings', () => {
    it('says why samples matter, and suggests Seattle for a natural language', () => {
        assert.match(sampleWarnings([], '*')[0], /no samples/);
        assert.match(sampleWarnings([], 'nl-NL')[0], /https:\/\/nl\.wikipedia\.org\/wiki\/Seattle/);
        assert.match(sampleWarnings([{ path: join(root, 'example.rb') }], '*')[0], /example\.rb has no origin/);
    });
});

describe('seattle', () => {
    it('uses the first locale, and nothing for any language', () => {
        assert.equal(seattle('en_AU,en'), 'https://en.wikipedia.org/wiki/Seattle');
        assert.equal(seattle('*'), undefined);
    });
});

describe('samplesReadme', () => {
    it('lists each sample with its origin, or no known origin', () => {
        const readme = samplesReadme('Ruby', [{ path: join(root, 'example.rb') }]);
        assert.match(readme, /^# Ruby Samples\n/);
        assert.match(readme, /`example\.rb`: no known origin\./);
    });
});

describe('sampleWords', () => {
    it('takes plain words, each once, skipping comments and entries with markers', () => {
        assert.deepEqual(sampleWords([join(root, 'words.txt')]), ['zorbal', 'quix-ly']);
    });

    it('takes the stems of a Hunspell .dic file', () => {
        assert.deepEqual(sampleWords([join(root, 'en_XX.dic')]), ['walk', 'talk', 'the']);
    });

    it('stops at the count', () => {
        assert.deepEqual(sampleWords([join(root, 'en_XX.dic')], 2), ['walk', 'talk']);
    });
});
