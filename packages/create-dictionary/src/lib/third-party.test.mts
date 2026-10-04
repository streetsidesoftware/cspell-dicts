import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, describe, it } from 'node:test';

import {
    hunspellShortcut,
    noThirdParty,
    parseThirdParty,
    sourcesYaml,
    type ThirdPartyOptions,
} from './third-party.mts';

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

function parse(more: Partial<ThirdPartyOptions>) {
    return parseThirdParty({ ...noThirdParty, ...more }, root);
}

describe('parseThirdParty', () => {
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
        assert.throws(() => parse({ defineSource: ['aoo'], addSourceFile: ['aoo=gone.txt'] }), /has no gone\.txt/);
        assert.throws(() => parse({ defineSource: ['aoo'] }), /has no files/);
        assert.throws(() => parse({ defineSource: ['aoo', 'aoo'] }), /two sources are named aoo/);
    });
});

describe('hunspellShortcut', () => {
    it('names the source after the .dic file, from its folder', () => {
        const source = hunspellShortcut('aoo/dicts/en_XX/en_XX.aff', root);
        assert.equal(source.name, 'en_XX');
        assert.deepEqual(
            source.files.map((f) => f.local),
            ['en_XX.dic', 'en_XX.aff'],
        );
    });
});

describe('sourcesYaml', () => {
    it('records only local paths, never where the source was on this machine', () => {
        const yaml = sourcesYaml(
            parse({
                defineSource: ['aoo'],
                addSourceFile: ['aoo=terms.txt'],
                addSourceUrl: ['aoo=https://example.com'],
            }),
        );
        assert.match(yaml, /- name: 'aoo'\n {4}files:\n {6}- 'terms\.txt'\n {4}url: 'https:\/\/example\.com'/);
        assert.doesNotMatch(yaml, new RegExp(root.replaceAll('\\', '\\\\')));
    });
});
