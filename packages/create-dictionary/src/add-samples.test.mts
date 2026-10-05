// Runs add-samples in a temporary dictionary folder and checks what it writes and the errors it gives.

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const bin = fileURLToPath(new URL('./add-samples.mts', import.meta.url));

let root = '';
let dir = '';

before(() => {
    root = mkdtempSync(join(tmpdir(), 'add-samples-'));
    dir = join(root, 'ruby');
    mkdirSync(join(dir, 'samples'), { recursive: true });
    const ext = { name: 'Ruby', languageSettings: [{ languageId: 'ruby', locale: '*', dictionaries: ['ruby'] }] };
    writeFileSync(join(dir, 'cspell-ext.json'), JSON.stringify(ext));
    writeFileSync(join(dir, 'samples', 'README.md'), '# Ruby Samples\n');
    writeFileSync(join(dir, 'samples', 'old.rb'), 'puts 1\n');
    writeFileSync(join(root, 'hello.rb'), 'puts zorbal\n');
    writeFileSync(join(root, 'old.rb'), 'puts 2\n');
});

after(() => rmSync(root, { recursive: true, force: true }));

interface Result {
    code: number | null;
    stdout: string;
    stderr: string;
}

/** Run the command in `cwd`, with no terminal to prompt in. */
function addSamples(cwd: string, ...args: string[]): Result {
    const result = spawnSync(process.execPath, [bin, ...args], { cwd, input: '', encoding: 'utf8' });
    return { code: result.status, stdout: result.stdout, stderr: result.stderr };
}

describe('add-samples', () => {
    it('copies a sample into samples/, and adds it to the README', () => {
        const result = addSamples(dir, '--add-sample', '../hello.rb', '--add-sample-origin', 'hello.rb=a test');
        assert.equal(result.code, 0, result.stderr);
        assert.equal(readFileSync(join(dir, 'samples', 'hello.rb'), 'utf8'), 'puts zorbal\n');
        const csv = readFileSync(join(dir, 'samples', 'sample-sources.csv'), 'utf8');
        assert.match(csv, /^\[hello\.rb\]\(\.\/hello\.rb\),a test,/m);
        const readme = readFileSync(join(dir, 'samples', 'README.md'), 'utf8');
        assert.match(readme, /\| \[hello\.rb\]\(\.\/hello\.rb\) +\| a test +\|/);
        assert.match(result.stdout, /Run pnpm test to check them\./);
    });

    it('refuses a name already in samples/', () => {
        const result = addSamples(dir, '--add-sample', '../old.rb');
        assert.equal(result.code, 1);
        assert.match(result.stderr, /samples\/old\.rb already exists/);
        assert.equal(readFileSync(join(dir, 'samples', 'old.rb'), 'utf8'), 'puts 1\n');
    });

    it('adds nothing when no sample can be added, such as a Wikipedia article for a file type', () => {
        const result = addSamples(dir, '--add-wikipedia-sample', 'Berlin');
        assert.equal(result.code, 0, result.stderr);
        assert.match(result.stdout, /No samples added\./);
        assert.equal(existsSync(join(dir, 'samples', 'berlin.md')), false);
    });

    it("refuses a folder that isn't a dictionary", () => {
        const result = addSamples(root, '--add-sample', 'hello.rb');
        assert.equal(result.code, 1);
        assert.match(result.stderr, /no cspell-ext\.json here/);
    });

    it('says which options to give when there is no terminal to prompt in', () => {
        const result = addSamples(dir);
        assert.equal(result.code, 1);
        assert.match(result.stderr, /No terminal to prompt in\. Give --add-sample or --add-wikipedia-sample\./);
    });
});
