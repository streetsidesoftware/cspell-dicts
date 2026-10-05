import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, describe, it } from 'node:test';

import {
    buildFiles,
    checkFile,
    checkFolder,
    copies,
    hunspellFile,
    noSourceOptions,
    parseSources,
    type SourceOptions,
    sourcesYaml,
    wordList,
} from './sources.mts';

let root = '';

before(() => {
    root = mkdtempSync(join(tmpdir(), 'create-dictionary-third-party-'));
    mkdirSync(join(root, 'aoo', 'dicts', 'en_XX'), { recursive: true });
    writeFileSync(join(root, 'aoo', 'dicts', 'en_XX', 'en_XX.dic'), '1\nzorbal\n');
    writeFileSync(join(root, 'aoo', 'dicts', 'en_XX', 'en_XX.aff'), 'SET UTF-8\n');
    writeFileSync(join(root, 'aoo', 'terms.txt'), 'zorbal\n');
    writeFileSync(join(root, 'LICENSE'), 'MIT\n');
});

after(() => rmSync(root, { recursive: true, force: true }));

function parse(more: Partial<SourceOptions>) {
    return parseSources({ ...noSourceOptions, ...more }, root);
}

describe('parseSources', () => {
    it('names a source after its folder, and keeps paths relative to it', () => {
        const [source] = parse({ defineSource: ['aoo'], addSourceFile: ['aoo=terms.txt'] });
        assert.equal(source.name, 'aoo');
        assert.deepEqual(source.files, [{ path: 'terms.txt', local: 'terms.txt' }]);
    });

    it("brings a Hunspell file's pair, to the same local folder", () => {
        const [source] = parse({ defineSource: ['aoo'], addSourceFile: ['aoo/en_XX.dic=dicts/en_XX/en_XX.dic'] });
        assert.deepEqual(source.files, [
            { path: 'dicts/en_XX/en_XX.dic', local: 'en_XX.dic' },
            { path: 'dicts/en_XX/en_XX.aff', local: 'en_XX.aff' },
        ]);
    });

    it('takes a file from outside the source only with a local path inside it', () => {
        const [source] = parse({
            defineSource: ['aoo'],
            addSourceFile: ['aoo=terms.txt'],
            addSourceLicense: ['aoo/LICENSE=../LICENSE'],
        });
        assert.deepEqual(source.license, { path: '../LICENSE', local: 'LICENSE' });
        assert.throws(
            () =>
                parse({
                    defineSource: ['aoo'],
                    addSourceFile: ['aoo=terms.txt'],
                    addSourceLicense: ['aoo=../LICENSE'],
                }),
            /outside the source aoo/,
        );
        assert.throws(
            () => parse({ defineSource: ['aoo'], addSourceFile: ['aoo/../x.txt=terms.txt'] }),
            /must stay inside src\/aoo\//,
        );
    });

    it('refuses an unknown source, a missing file, a source with no files, and a repeated name', () => {
        assert.throws(() => parse({ addSourceFile: ['nope=terms.txt'] }), /no source is named nope/);
        assert.throws(
            () => parse({ defineSource: ['aoo'], addSourceFile: ['aoo=gone.txt'] }),
            /--add-source-file aoo: gone\.txt not found/,
        );
        assert.throws(() => parse({ defineSource: ['aoo'] }), /has no files/);
        assert.throws(() => parse({ defineSource: ['aoo', 'aoo'] }), /two sources are named aoo/);
    });
});

describe('checkFile', () => {
    it('accepts a file that exists, and a Hunspell file whose pair exists, from either file', () => {
        assert.equal(checkFile(root, 'aoo/terms.txt'), true);
        assert.equal(checkFile(root, 'aoo/dicts/en_XX/en_XX.dic'), true);
        assert.equal(checkFile(root, 'aoo/dicts/en_XX/en_XX.aff'), true);
    });

    it('names what is missing', () => {
        assert.match(String(checkFile(root, 'gone.txt')), /^gone\.txt not found\.$/);
        assert.match(String(checkFile(root, 'gone.dic')), /gone\.dic and gone\.aff not found\. A Hunspell file needs/);
    });

    it('refuses a folder that is not there, or is a file', () => {
        assert.equal(checkFolder(root, 'aoo'), true);
        assert.match(String(checkFolder(root, 'aoo/terms.txt')), /isn't a folder/);
    });
});

describe('wordList', () => {
    it('has no name, so it is copied into src/ and built from there', () => {
        const source = wordList('aoo/terms.txt', root, false);
        assert.equal(source.name, undefined);
        assert.deepEqual(buildFiles(source), ['src/terms.txt']);
        assert.deepEqual(copies(source), [{ from: join(root, 'aoo', 'terms.txt'), to: 'src/terms.txt' }]);
    });

    it('copies nothing when it starts empty', () => {
        assert.deepEqual(copies(wordList('nope.txt', root, true)), []);
    });
});

describe('hunspellFile', () => {
    it('is the source hunspell, with its pair, so it is kept out of the way in src/hunspell/', () => {
        const source = hunspellFile('aoo/dicts/en_XX/en_XX.aff', root);
        assert.equal(source.name, 'hunspell');
        assert.deepEqual(
            source.files.map((f) => f.local),
            ['en_XX.dic', 'en_XX.aff'],
        );
        assert.deepEqual(buildFiles(source), ['src/hunspell/en_XX.dic']);
    });

    it('needs its pair', () => {
        assert.throws(() => hunspellFile('gone.dic', root), /gone\.dic: gone\.dic and gone\.aff not found/);
    });

    it('takes a license like any named source, with paths from where the command runs', () => {
        const given = hunspellFile('aoo/dicts/en_XX/en_XX.dic', root);
        const [source] = parseSources({ ...noSourceOptions, addSourceLicense: ['hunspell=LICENSE'] }, root, [given]);
        assert.deepEqual(source.license, { path: 'LICENSE', local: 'LICENSE' });
    });
});

describe('sourcesYaml', () => {
    it('records only local paths, never where the source was on this machine', () => {
        const yaml = sourcesYaml([
            ...parse({
                defineSource: ['aoo'],
                addSourceFile: ['aoo=terms.txt'],
                addSourceUrl: ['aoo=https://example.com'],
            }),
            wordList('aoo/terms.txt', root, false),
        ]);
        assert.match(yaml, /- name: 'aoo'\n {4}files:\n {6}- 'terms\.txt'\n {4}url: 'https:\/\/example\.com'/);
        assert.doesNotMatch(yaml, new RegExp(root.replaceAll('\\', '\\\\')));
        assert.equal(yaml.match(/- name:/g)?.length, 1);
    });
});
