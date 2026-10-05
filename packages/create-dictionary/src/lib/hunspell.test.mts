import assert from 'node:assert/strict';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { hunspellPair, isHunspellFile } from './hunspell.mts';

describe('isHunspellFile', () => {
    it('is true for .dic and .aff files', () => {
        assert.equal(isHunspellFile('en_AU.dic'), true);
        assert.equal(isHunspellFile(join('dir', 'en_AU.aff')), true);
    });

    it('is false for other files', () => {
        assert.equal(isHunspellFile('words.txt'), false);
        assert.equal(isHunspellFile('dic'), false);
    });
});

describe('hunspellPair', () => {
    it('gives the .dic and .aff files next to either one', () => {
        const pair = [join('dir', 'en_AU.dic'), join('dir', 'en_AU.aff')];
        assert.deepEqual(hunspellPair(join('dir', 'en_AU.dic')), pair);
        assert.deepEqual(hunspellPair(join('dir', 'en_AU.aff')), pair);
    });
});
