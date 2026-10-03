import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, describe, it } from 'node:test';

import { setUpPackage } from './pnpm.mts';
import type { Repo } from './repo.mts';

let root = '';
let repo: Repo;
let packageDir = '';

before(() => {
    root = mkdtempSync(join(tmpdir(), 'create-dictionary-pnpm-'));
    repo = { rootDir: root, dictionariesDir: join(root, 'dictionaries') };
    packageDir = join(repo.dictionariesDir, 'pkg');
    mkdirSync(packageDir, { recursive: true });
    // No build script, so the build step fails.
    writeFileSync(join(packageDir, 'package.json'), JSON.stringify({ name: 'pkg', private: true }));
});

after(() => rmSync(root, { recursive: true, force: true }));

describe('setUpPackage', () => {
    it('runs nothing when no step is asked for', () => {
        assert.doesNotThrow(() => setUpPackage(packageDir, repo, { install: false, build: false }));
    });

    it('names the failed step and the package', () => {
        assert.throws(
            () => setUpPackage(packageDir, repo, { install: false, build: true }),
            /pnpm run build failed in dictionaries[\\/]pkg/,
        );
    });
});
