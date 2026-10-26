import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { publicationCandidates, publicationVersions, recordPending, recordTrusted } from './publication.mts';

describe('publicationVersions', () => {
    it('releases a new dictionary as 1.0.0 and keeps its alpha', () => {
        assert.deepEqual(publicationVersions('0.0.1-alpha.0'), { releaseAs: '1.0.0', version: '0.0.1-alpha.0' });
    });

    it('releases a dictionary released while private at the next minor, after an alpha of it', () => {
        assert.deepEqual(publicationVersions('1.0.3'), { releaseAs: '1.1.0', version: '1.1.0-alpha.0' });
    });

    it('adds an alpha to a version below 1.0.0 that is not a prerelease', () => {
        assert.deepEqual(publicationVersions('0.2.0'), { releaseAs: '1.0.0', version: '1.0.0-alpha.0' });
    });
});

describe('publicationCandidates', () => {
    const packages = [
        { dir: 'perl', name: '@cspell/dict-perl', version: '4.0.0' },
        { dir: 'new', name: '@cspell/dict-new', version: '0.0.1-alpha.0', private: true },
        { dir: 'internal', name: '@cspell/dict-internal', version: '1.0.5', private: true },
        { dir: 'unlisted', name: '@cspell/dict-unlisted', version: '0.0.1-alpha.0', private: true },
    ];

    it('lists private dictionaries not marked false and in the Release Please config', () => {
        const published = { '@cspell/dict-perl': { trustedPublishing: true }, '@cspell/dict-internal': false as const };
        const released = ['@cspell/dict-perl', '@cspell/dict-new', '@cspell/dict-internal'];
        assert.deepEqual(publicationCandidates(packages, published, released), [
            { dir: 'new', name: '@cspell/dict-new', releaseAs: '1.0.0', version: '0.0.1-alpha.0' },
        ]);
    });
});

describe('recordPending', () => {
    it('adds a waiting entry', () => {
        assert.deepEqual(recordPending({}, 'a'), { a: { trustedPublishing: false } });
    });

    it('keeps an existing entry', () => {
        assert.deepEqual(recordPending({ a: false }, 'a'), { a: false });
    });
});

describe('recordTrusted', () => {
    it('sets trustedPublishing', () => {
        assert.deepEqual(recordTrusted({ a: { trustedPublishing: false } }, 'a', true), {
            a: { trustedPublishing: true },
        });
    });

    it('refuses a dictionary never to be published', () => {
        assert.throws(() => recordTrusted({ a: false }, 'a', true), /never to be published/);
    });
});
