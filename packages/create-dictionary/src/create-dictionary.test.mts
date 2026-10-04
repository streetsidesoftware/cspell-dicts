// Runs create-dictionary in a temporary repo and checks what it writes and the errors it gives.

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const bin = fileURLToPath(new URL('./create-dictionary.mts', import.meta.url));

let root = '';

before(() => {
    root = mkdtempSync(join(tmpdir(), 'create-dictionary-'));
    // An existing package, for the name checks.
    const existing = join(root, 'dictionaries', 'en_AU');
    mkdirSync(existing, { recursive: true });
    writeFileSync(join(existing, 'package.json'), JSON.stringify({ name: '@cspell/dict-en-au' }));
    writeFileSync(
        join(existing, 'cspell-ext.json'),
        JSON.stringify({
            dictionaryDefinitions: [
                { name: 'en-au', path: './en-au.txt' },
                { name: 'en-au-extra', path: './extra.txt' },
            ],
        }),
    );
    writeFileSync(join(root, 'words.txt'), 'zorbal\nquixly\n');
    writeFileSync(join(root, "it's.txt"), 'zorbal\n');
    writeFileSync(join(root, 'pair.dic'), '1\nzorbal\n');
    writeFileSync(join(root, 'pair.aff'), 'SET UTF-8\n');
    writeFileSync(join(root, 'lonely.dic'), '1\nzorbal\n');
});

after(() => rmSync(root, { recursive: true, force: true }));

interface Result {
    code: number | null;
    stdout: string;
    stderr: string;
}

/** Run the command in the temporary repo, with no terminal to prompt in. */
function create(...args: string[]): Result {
    const result = spawnSync(process.execPath, [bin, '--root', root, '--skip-install', ...args], {
        cwd: root,
        env: { ...process.env, INIT_CWD: root },
        input: '',
        encoding: 'utf8',
    });
    return { code: result.status, stdout: result.stdout, stderr: result.stderr };
}

/** Run with --yes and the options most tests need, for a package named `name`. */
function createYes(name: string, ...args: string[]): Result {
    return create('--yes', name, '--description', 'Test words', '--language-id', 'ruby', '--no-build', ...args);
}

function packageFile(name: string, file: string): string {
    return readFileSync(join(root, 'dictionaries', name, file), 'utf8');
}

function assertFails(result: Result, message: RegExp): void {
    assert.equal(result.code, 1, result.stdout + result.stderr);
    assert.match(result.stderr, message);
}

describe('help', () => {
    it('lists the options', () => {
        const result = create('--help');
        assert.equal(result.code, 0);
        for (const option of [
            '--yes',
            '--source',
            '--allow-missing-source',
            '--locale',
            '--language-id',
            '--description',
            '--package-description',
        ]) {
            assert.ok(result.stdout.includes(option), option);
        }
    });

    it('hides the options for tests', () => {
        const result = create('--help');
        for (const option of ['--root', '--skip-install']) {
            assert.ok(!result.stdout.includes(option), option);
        }
    });
});

describe('a new package', () => {
    it('is created from the templates and the source', () => {
        const result = createYes('plain', 'words.txt');
        assert.equal(result.code, 0, result.stderr);
        for (const file of [
            'package.json',
            'README.md',
            'cspell-ext.json',
            'cspell.json',
            'LICENSE',
            'cspell-tools.config.yaml',
            'dict/README.md',
            'dict/plain.txt',
            'src/README.md',
            'src/words.txt',
        ]) {
            assert.ok(existsSync(join(root, 'dictionaries', 'plain', file)), file);
        }
        const pkg = JSON.parse(packageFile('plain', 'package.json'));
        assert.equal(pkg.name, '@cspell/dict-plain');
        assert.equal(pkg.private, true);
        assert.equal(pkg.description, 'Plain dictionary for cspell. -- Private until verified');
        assert.match(packageFile('plain', 'cspell-ext.json'), /"description": "Test words"/);
        assert.equal(packageFile('plain', 'src/words.txt'), 'zorbal\nquixly\n');
        const ext = packageFile('plain', 'cspell-ext.json');
        assert.match(ext, /"languageId": "ruby"/);
        assert.match(ext, /"locale": "\*"/);
    });

    it('escapes values in JSON and YAML files', () => {
        const result = createYes('escaped', "it's.txt", '--friendly-name', 'Q "Quoted"');
        assert.equal(result.code, 0, result.stderr);
        const pkg = JSON.parse(packageFile('escaped', 'package.json'));
        assert.ok(pkg.keywords.includes('Q "Quoted"'));
        assert.match(packageFile('escaped', 'cspell-tools.config.yaml'), /filename: 'src\/it''s\.txt'/);
    });

    it('copies both files of a Hunspell source and stores it as a trie', () => {
        const result = createYes('hunspell', 'pair.dic');
        assert.equal(result.code, 0, result.stderr);
        assert.ok(existsSync(join(root, 'dictionaries', 'hunspell', 'src', 'pair.dic')));
        assert.ok(existsSync(join(root, 'dictionaries', 'hunspell', 'src', 'pair.aff')));
        assert.match(packageFile('hunspell', 'cspell-tools.config.yaml'), /format: 'trie3'/);
    });
});

describe('the name', () => {
    it('is required', () => {
        assertFails(
            create('--yes', '--allow-missing-source', '--language-id', 'ruby'),
            /missing\. Give the directory name/,
        );
    });

    it('has only letters, digits, "_", and "-"', () => {
        assertFails(createYes('bad.name', '--allow-missing-source'), /can only have letters/);
    });

    it('is at most 50 characters', () => {
        assertFails(createYes('a'.repeat(51), '--allow-missing-source'), /longer than 50 characters/);
    });

    it('is not reserved on Windows', () => {
        assertFails(createYes('con', '--allow-missing-source'), /reserved on Windows/);
        assertFails(createYes('LPT1', '--allow-missing-source'), /reserved on Windows/);
    });

    it('is not an existing directory', () => {
        assertFails(createYes('en_AU', '--allow-missing-source'), /dictionaries\/en_AU already exists/);
    });

    it('does not give a package name already in use', () => {
        assertFails(
            createYes('en-AU', '--allow-missing-source'),
            /@cspell\/dict-en-au is already used by dictionaries\/en_AU/,
        );
    });

    it('does not give a dictionary ID already in use', () => {
        assertFails(
            createYes('en-au-extra', '--allow-missing-source'),
            /dictionary ID en-au-extra is already used by dictionaries\/en_AU/,
        );
    });

    it('is not given twice with different values', () => {
        assertFails(create('one', '--name', 'two'), /the name is given twice/);
    });
});

describe('the source', () => {
    it('must exist', () => {
        assertFails(createYes('missing', 'nope.txt'), /nope\.txt not found/);
    });

    it('can be missing with --allow-missing-source, which creates an empty word list', () => {
        const result = createYes('allowed', 'nope.txt', '--allow-missing-source');
        assert.equal(result.code, 0, result.stderr);
        assert.equal(packageFile('allowed', 'src/nope.txt'), '# Allowed Terms\n');
    });

    it('is still copied with --allow-missing-source when it exists', () => {
        const result = createYes('found', 'words.txt', '--allow-missing-source');
        assert.equal(result.code, 0, result.stderr);
        assert.equal(packageFile('found', 'src/words.txt'), 'zorbal\nquixly\n');
    });

    it('defaults to an empty src/<name>.txt with only --allow-missing-source', () => {
        const result = createYes('empty', '--allow-missing-source');
        assert.equal(result.code, 0, result.stderr);
        assert.equal(packageFile('empty', 'src/empty.txt'), '# Empty Terms\n');
    });

    it('is required with --yes', () => {
        assertFails(createYes('nosource'), /missing source/);
    });

    it('needs both Hunspell files, even with --allow-missing-source', () => {
        assertFails(createYes('lonely', 'lonely.dic', '--allow-missing-source'), /Not found: lonely\.aff/);
    });
});

describe('locale and file type', () => {
    it('are not both "*"', () => {
        assertFails(
            create('--yes', 'everywhere', '--description', 'Test words', '--allow-missing-source', '--no-build'),
            /turns the dictionary on for every file/,
        );
    });

    it('can leave the file type as "*" when the locale is set', () => {
        const result = create(
            '--yes',
            'natural',
            '--description',
            'Test words',
            '--allow-missing-source',
            '--locale',
            'en',
            '--no-build',
        );
        assert.equal(result.code, 0, result.stderr);
        assert.match(packageFile('natural', 'cspell-ext.json'), /"locale": "en"/);
    });
});

describe('the command line', () => {
    it('fails without --yes when there is no terminal to prompt in', () => {
        assertFails(create('noterminal'), /No terminal to prompt in/);
    });

    it('fails on an unknown option', () => {
        assertFails(create('--bogus'), /unknown option '--bogus'/);
    });

    it('fails when --root has no dictionaries folder', () => {
        const empty = mkdtempSync(join(tmpdir(), 'create-dictionary-empty-'));
        try {
            const result = spawnSync(process.execPath, [bin, '--root', empty, '--yes', 'x'], { encoding: 'utf8' });
            assert.equal(result.status, 1);
            assert.match(result.stderr, /no dictionaries folder/);
        } finally {
            rmSync(empty, { recursive: true, force: true });
        }
    });
});
