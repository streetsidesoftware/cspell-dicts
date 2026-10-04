import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, parse } from 'node:path';
import { after, before, describe, it } from 'node:test';

import { findRepoRoot, gitUserName, openRepo, readTakenNames } from './repo.mts';

let root = '';

before(() => {
    root = mkdtempSync(join(tmpdir(), 'create-dictionary-repo-'));
});

after(() => rmSync(root, { recursive: true, force: true }));

describe('findRepoRoot', () => {
    it('finds the nearest folder with a .git directory', () => {
        const repo = join(root, 'with-dir');
        mkdirSync(join(repo, '.git'), { recursive: true });
        mkdirSync(join(repo, 'a', 'b'), { recursive: true });
        assert.equal(findRepoRoot(join(repo, 'a', 'b')), repo);
    });

    it('finds the nearest folder with a .git file, as in a worktree', () => {
        const repo = join(root, 'with-file');
        mkdirSync(join(repo, 'a'), { recursive: true });
        writeFileSync(join(repo, '.git'), 'gitdir: elsewhere\n');
        assert.equal(findRepoRoot(join(repo, 'a')), repo);
    });

    it('fails when no folder above has .git', () => {
        assert.throws(() => findRepoRoot(parse(root).root), /no git repository found above/);
    });
});

describe('gitUserName', () => {
    it('reads user.name from git config', () => {
        const dir = join(root, 'git-user');
        mkdirSync(dir);
        spawnSync('git', ['init', '-q'], { cwd: dir });
        spawnSync('git', ['config', 'user.name', 'Ana Lee'], { cwd: dir });
        assert.equal(gitUserName(dir), 'Ana Lee');
    });
});

describe('openRepo', () => {
    it('gives the dictionaries folder', () => {
        const repo = join(root, 'open');
        mkdirSync(join(repo, 'dictionaries'), { recursive: true });
        assert.deepEqual(openRepo(repo), { rootDir: repo, dictionariesDir: join(repo, 'dictionaries') });
    });

    it('fails without a dictionaries folder', () => {
        const repo = join(root, 'empty');
        mkdirSync(repo, { recursive: true });
        assert.throws(() => openRepo(repo), /no dictionaries folder/);
    });
});

describe('readTakenNames', () => {
    it('reads package names and dictionary IDs, lowercase, from every package', async () => {
        const repo = join(root, 'taken');
        const pkg = join(repo, 'dictionaries', 'en_AU');
        mkdirSync(pkg, { recursive: true });
        mkdirSync(join(repo, 'dictionaries', 'no-package'), { recursive: true });
        writeFileSync(join(pkg, 'package.json'), JSON.stringify({ name: '@cspell/dict-en-AU' }));
        // Comments, a local YAML import, and a definition in languageSettings.
        writeFileSync(
            join(pkg, 'cspell-ext.json'),
            `// cSpell Settings
{
    "import": ["./more.yaml"],
    "dictionaryDefinitions": [{ "name": "en-AU", "path": "./a.txt" }],
    "languageSettings": [{ "languageId": "*", "dictionaryDefinitions": [{ "name": "en-au-lang", "path": "./b.txt" }] }]
}
`,
        );
        writeFileSync(join(pkg, 'more.yaml'), 'dictionaryDefinitions:\n  - name: en-au-yaml\n    path: ./c.txt\n');

        // A bundle that imports another package's config, as dict-cspell-bundle does. Read after en_AU.
        const bundle = join(repo, 'dictionaries', 'zz-bundle');
        mkdirSync(bundle);
        writeFileSync(join(bundle, 'package.json'), JSON.stringify({ name: '@cspell/zz-bundle' }));
        writeFileSync(join(bundle, 'cspell-ext.json'), JSON.stringify({ import: ['../en_AU/cspell-ext.json'] }));

        const taken = await readTakenNames(openRepo(repo));
        assert.deepEqual(
            [...taken.packages],
            [
                ['@cspell/dict-en-au', 'dictionaries/en_AU'],
                ['@cspell/zz-bundle', 'dictionaries/zz-bundle'],
            ],
        );
        assert.deepEqual([...taken.dictionaryIds.keys()].sort(), ['en-au', 'en-au-lang', 'en-au-yaml']);
        // Imports of other packages don't make the bundle the owner.
        for (const owner of taken.dictionaryIds.values()) assert.equal(owner, 'dictionaries/en_AU');
    });
});
