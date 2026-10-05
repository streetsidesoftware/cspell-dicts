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
    writeFileSync(join(root, 'more.txt'), 'blivet\n');
    mkdirSync(join(root, 'vendor', 'lists'), { recursive: true });
    writeFileSync(join(root, 'vendor', 'lists', 'terms.txt'), 'blorp\n');
    writeFileSync(join(root, 'vendor', 'README.md'), 'About up\n');
    writeFileSync(join(root, 'COPYING'), 'MIT\n');
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
            '--placeholder-word-lists',
            '--locale',
            '--language-id',
            '--description',
            '--package-description',
            '--contributor',
            '--keyword',
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
            'src/additional_words.txt',
            'src/exclude_words.txt',
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

    it('lists each --contributor in package.json, and none without one', () => {
        const result = createYes(
            'people',
            'words.txt',
            '--contributor',
            'Jane Doe (https://example.com/jane-doe)',
            '--contributor',
            'John Roe',
        );
        assert.equal(result.code, 0, result.stderr);
        const pkg = JSON.parse(packageFile('people', 'package.json'));
        assert.deepEqual(pkg.contributors, ['Jane Doe (https://example.com/jane-doe)', 'John Roe']);
        assert.deepEqual(JSON.parse(packageFile('plain', 'package.json')).contributors, []);
    });

    it('adds each --keyword to package.json', () => {
        const result = createYes('searchable', 'words.txt', '--keyword', 'golang', '--keyword', 'go language');
        assert.equal(result.code, 0, result.stderr);
        const { keywords } = JSON.parse(packageFile('searchable', 'package.json'));
        assert.deepEqual(keywords.slice(-2), ['golang', 'go language']);
    });

    it('leaves out the word files with --no-additional-words and --no-exclude-words', () => {
        const result = createYes('bare', 'words.txt', '--no-additional-words', '--no-exclude-words');
        assert.equal(result.code, 0, result.stderr);
        assert.ok(!existsSync(join(root, 'dictionaries', 'bare', 'src', 'additional_words.txt')));
        assert.ok(!existsSync(join(root, 'dictionaries', 'bare', 'src', 'exclude_words.txt')));
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
        assert.ok(existsSync(join(root, 'dictionaries', 'hunspell', 'src', 'hunspell', 'pair.dic')));
        assert.ok(existsSync(join(root, 'dictionaries', 'hunspell', 'src', 'hunspell', 'pair.aff')));
        assert.match(packageFile('hunspell', 'src/sources.yaml'), /name: 'hunspell'/);
        assert.match(result.stderr, /warning: the source hunspell has no license/);
        assert.match(packageFile('hunspell', 'cspell-tools.config.yaml'), /format: 'trie3'/);
        assert.match(result.stdout, /Not built yet[\s\S]*lower maxDepth/);
    });

    it('copies samples, with their origins', () => {
        writeFileSync(join(root, 'example.rb'), 'puts zorbal\n');
        const result = createYes(
            'withsample',
            'words.txt',
            '--add-sample',
            'example.rb',
            '--add-sample-origin',
            'example.rb=made up',
        );
        assert.equal(result.code, 0, result.stderr);
        assert.doesNotMatch(result.stderr, /warning/);
        assert.equal(packageFile('withsample', 'samples/example.rb'), 'puts zorbal\n');
        assert.match(packageFile('withsample', 'samples/README.md'), /`example\.rb`: made up\./);
    });

    it('warns about a locale that is a name, and keeps it', () => {
        const result = create(
            '--yes',
            'named',
            '--description',
            'Test words',
            '--placeholder-word-lists',
            '--locale',
            'english',
            '--no-build',
            '--no-wikipedia-sample',
        );
        assert.equal(result.code, 0, result.stderr);
        assert.match(result.stderr, /warning: locale: "english" isn't a known locale\. Did you mean en \(English\)/);
        assert.match(packageFile('named', 'cspell-ext.json'), /"locale": "english"/);
    });

    it('takes the Hunspell depth from --hunspell-depth', () => {
        const result = createYes('depth', 'pair.dic', '--hunspell-depth', '0');
        assert.equal(result.code, 0, result.stderr);
        assert.match(packageFile('depth', 'cspell-tools.config.yaml'), /maxDepth: 0/);
        assertFails(createYes('baddepth', 'pair.dic', '--hunspell-depth', 'deep'), /give a whole number/);
    });
});

describe('the name', () => {
    it('is required', () => {
        assertFails(
            create('--yes', '--placeholder-word-lists', '--language-id', 'ruby'),
            /missing\. Give the directory name/,
        );
    });

    it('has only letters, digits, "_", and "-"', () => {
        assertFails(createYes('bad.name', '--placeholder-word-lists'), /can only have letters/);
    });

    it('is at most 50 characters', () => {
        assertFails(createYes('a'.repeat(51), '--placeholder-word-lists'), /longer than 50 characters/);
    });

    it('is not reserved on Windows', () => {
        assertFails(createYes('con', '--placeholder-word-lists'), /reserved on Windows/);
        assertFails(createYes('LPT1', '--placeholder-word-lists'), /reserved on Windows/);
    });

    it('is not an existing directory', () => {
        assertFails(createYes('en_AU', '--placeholder-word-lists'), /dictionaries\/en_AU already exists/);
    });

    it('does not give a package name already in use', () => {
        assertFails(
            createYes('en-AU', '--placeholder-word-lists'),
            /@cspell\/dict-en-au is already used by dictionaries\/en_AU/,
        );
    });

    it('does not give a dictionary ID already in use', () => {
        assertFails(
            createYes('en-au-extra', '--placeholder-word-lists'),
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

    it('can be missing with --placeholder-word-lists, which creates an empty word list', () => {
        const result = createYes('allowed', 'nope.txt', '--placeholder-word-lists');
        assert.equal(result.code, 0, result.stderr);
        assert.equal(packageFile('allowed', 'src/nope.txt'), '# Allowed Terms\n');
    });

    it('is still copied with --placeholder-word-lists when it exists', () => {
        const result = createYes('found', 'words.txt', '--placeholder-word-lists');
        assert.equal(result.code, 0, result.stderr);
        assert.equal(packageFile('found', 'src/words.txt'), 'zorbal\nquixly\n');
    });

    it('defaults to an empty src/<name>.txt with only --placeholder-word-lists', () => {
        const result = createYes('empty', '--placeholder-word-lists');
        assert.equal(result.code, 0, result.stderr);
        assert.equal(packageFile('empty', 'src/empty.txt'), '# Empty Terms\n');
    });

    it('is required with --yes', () => {
        assertFails(createYes('nosource'), /missing source/);
    });

    it('needs both Hunspell files, even with --placeholder-word-lists', () => {
        assertFails(createYes('lonely', 'lonely.dic', '--placeholder-word-lists'), /lonely\.aff not found/);
    });
});

describe('several sources', () => {
    it('are combined from positional arguments and --source', () => {
        const result = createYes('several', 'words.txt', '--source', 'pair.aff', '--source', 'more.txt');
        assert.equal(result.code, 0, result.stderr);
        for (const file of ['src/words.txt', 'src/hunspell/pair.dic', 'src/hunspell/pair.aff', 'src/more.txt']) {
            assert.ok(existsSync(join(root, 'dictionaries', 'several', file)), file);
        }
        const config = packageFile('several', 'cspell-tools.config.yaml');
        assert.match(config, /filename: 'src\/words\.txt'/);
        assert.match(config, /filename: 'src\/hunspell\/pair\.dic'/);
        assert.match(config, /filename: 'src\/more\.txt'/);
        assert.match(config, /format: 'trie3'/);
    });

    it('build a Hunspell source from its .dic file when only the .aff file is given', () => {
        const result = createYes('affonly', 'pair.aff');
        assert.equal(result.code, 0, result.stderr);
        assert.match(packageFile('affonly', 'cspell-tools.config.yaml'), /filename: 'src\/hunspell\/pair\.dic'/);
    });

    it('include a third-party source defined with options', () => {
        const result = createYes(
            'thirdparty',
            '--define-source',
            'up=vendor',
            '--add-source-file',
            'up=lists/terms.txt',
            '--add-source-license',
            'up/LICENSE=../COPYING',
            '--add-source-readme',
            'up=README.md',
            '--add-source-url',
            'up=https://example.com/up',
        );
        assert.equal(result.code, 0, result.stderr);
        assert.equal(packageFile('thirdparty', 'src/up/lists/terms.txt'), 'blorp\n');
        assert.ok(existsSync(join(root, 'dictionaries', 'thirdparty', 'src', 'up', 'LICENSE')));
        assert.match(packageFile('thirdparty', 'cspell-tools.config.yaml'), /filename: 'src\/up\/lists\/terms\.txt'/);
        assert.match(packageFile('thirdparty', 'src/sources.yaml'), /license: 'LICENSE'/);
        assert.match(packageFile('thirdparty', 'src/sources.yaml'), /readme: 'README\.md'/);
        const { files } = JSON.parse(packageFile('thirdparty', 'package.json'));
        assert.ok(files.includes('src/up/LICENSE') && files.includes('src/up/README.md'), files.join(', '));
        assert.doesNotMatch(result.stderr, /warning: the source/);
    });

    it('refuse a third-party file outside its source without a local path', () => {
        assertFails(
            createYes('outside', '--define-source', 'up=vendor', '--add-source-file', 'up=../COPYING'),
            /outside the source up/,
        );
    });

    it('can each be missing with --placeholder-word-lists', () => {
        const result = createYes('partial', 'words.txt', 'later.txt', '--placeholder-word-lists');
        assert.equal(result.code, 0, result.stderr);
        assert.equal(packageFile('partial', 'src/later.txt'), '# Partial Terms\n');
        assert.equal(packageFile('partial', 'src/words.txt'), 'zorbal\nquixly\n');
    });
});

describe('locale and file type', () => {
    it('are not both "*"', () => {
        assertFails(
            create('--yes', 'everywhere', '--description', 'Test words', '--placeholder-word-lists', '--no-build'),
            /enables the dictionary for every file/,
        );
    });

    it('can leave the file type as "*" when the locale is set', () => {
        const result = create(
            '--yes',
            'natural',
            '--description',
            'Test words',
            '--placeholder-word-lists',
            '--locale',
            'en',
            '--no-build',
            '--no-wikipedia-sample',
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
