// cspell:ignore wooorm

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { sourcesCsv } from './sources-table.mts';

const repo = 'https://github.com/streetsidesoftware/cspell-dicts/blob/main/dictionaries/de_AR/src';

/** The row of the one source given. */
function row(...args: Parameters<typeof sourcesCsv>): string {
    return sourcesCsv(...args).split('\n')[1];
}

describe('sourcesCsv', () => {
    it('lists a local source by its URL, with its license, updated by hand', () => {
        const csv = sourcesCsv('dictionaries/de_AR', [
            { name: 'hunspell', url: 'https://github.com/elastic/hunspell', license: 'LICENSE' },
        ]);
        assert.equal(
            csv,
            'Source,From,License,Updated\n' +
                `hunspell,<https://github.com/elastic/hunspell>,[LICENSE](${repo}/hunspell/LICENSE),by hand\n`,
        );
    });

    it('links a GitHub source to its folder, at its ref, kept current by the sync', () => {
        const license = { path: '../../license', local: 'license' };
        const tree = 'https://github.com/wooorm/dictionaries/tree/HEAD/dictionaries/de';
        assert.equal(
            row('dictionaries/de_AR', [{ name: 'de', github: 'wooorm/dictionaries/dictionaries/de', license }]),
            `de,"[wooorm/dictionaries, dictionaries/de](${tree})",[license](${repo}/de/license),"weekly, by \`pnpm run sync\`"`,
        );
        assert.match(
            row('d', [{ name: 'x', github: 'o/r', ref: 'v1.2.0' }]),
            /\[o\/r\]\(https:\/\/github\.com\/o\/r\/tree\/v1\.2\.0\)/,
        );
    });

    it('links an npm source to its package, with a scope, a path, and a version', () => {
        assert.match(
            row('d', [{ name: 'en', npm: '@scope/words/dict', version: '2.0.0' }]),
            /^en,"\[@scope\/words@2\.0\.0, dict\]\(https:\/\/www\.npmjs\.com\/package\/@scope\/words\/v\/2\.0\.0\)",/,
        );
    });

    it('says unknown for a source with no URL or license', () => {
        assert.equal(row('d', [{ name: 'mine' }]), 'mine,unknown,unknown,by hand');
    });
});
