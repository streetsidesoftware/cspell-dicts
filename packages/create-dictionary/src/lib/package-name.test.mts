import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { toPackageName } from './package-name.mts';

describe('toPackageName', () => {
    it('lowercases and replaces characters other than a-z, 0-9, and "-"', () => {
        assert.equal(toPackageName('en_AU'), 'en-au');
        assert.equal(toPackageName('medical-terms'), 'medical-terms');
        assert.equal(toPackageName('fr_FR_90'), 'fr-fr-90');
    });
});
