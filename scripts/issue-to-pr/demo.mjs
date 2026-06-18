#!/usr/bin/env node

// Local, offline demo of the issue-to-pr proof-of-concept pipeline.
//
//   Issue Created -> Workflow Runs -> Dictionary Updated -> PR Created
//
// This runs the *same* phase 4, 6 and 8 logic the workflow uses
// (.github/workflows/issue-to-pr.yml), against a throwaway fixture
// dictionary under a temp directory, so it never touches real files in
// `dictionaries/`. It does not call the GitHub API - the "PR Created"
// phase just prints what would be sent to `peter-evans/create-pull-request`.
//
// Run with: node scripts/issue-to-pr/demo.mjs

import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { parseIssueForm, parseWords, parseNotes, validateFile } from './parse-issue.mjs';
import { insertWords } from './insert-words.mjs';
import { formatPrBody } from './format-pr-body.mjs';

const ISSUE_NUMBER = '123';
// The fixture has *two* source files for the "git" dictionary, mirroring the
// real repo (terms.txt + additional_words.txt) - the issue creator names the
// exact file, so there's nothing to disambiguate automatically. "fetch" is
// deliberately also one of terms.txt's pre-existing words, to demonstrate
// the "already present, skipped" path alongside genuinely new words. The
// notes deliberately contain "Fixes #999" to demonstrate that it ends up
// inert (code-fenced) in the PR body rather than closing an unrelated issue.
const ISSUE_BODY = `### File

git/src/terms.txt

### Words

push
pull
github
fetch

### Additional Notes

Standard Docker CLI subcommands - see https://docs.docker.com/reference/cli/docker/.
Not related to Fixes #999, just demonstrating that this text can't close issues.
`;

function section(title) {
    console.log(`\n=== ${title} ===`);
}

function main() {
    const tmpRoot = mkdtempSync(path.join(tmpdir(), 'issue-to-pr-demo-'));
    const dictionariesRoot = path.join(tmpRoot, 'dictionaries');
    const srcDir = path.join(dictionariesRoot, 'git', 'src');
    mkdirSync(srcDir, { recursive: true });
    writeFileSync(
        path.join(srcDir, 'terms.txt'),
        [
            'clone',
            'commit',
            'fetch',
            '',
            '# Please add new terms above this line, one per line. They will get automatically sorted.',
            '',
        ].join('\n'),
        'utf8',
    );
    writeFileSync(path.join(srcDir, 'additional_words.txt'), ['merge', ''].join('\n'), 'utf8');

    try {
        section('1. Issue Created');
        console.log(`Issue #${ISSUE_NUMBER} opened using the "Add Words to a Dictionary" form:\n`);
        console.log(ISSUE_BODY);

        section('2. Workflow Runs - parse issue (Phase 4)');
        const sections = parseIssueForm(ISSUE_BODY);
        const targetFile = validateFile(sections.file, dictionariesRoot);
        // In the real workflow $DICTIONARIES_ROOT is relative ("dictionaries"), so
        // the file output looks like "dictionaries/git/src/terms.txt". Here it's
        // re-derived relative to the fixture root, just for realistic-looking output.
        const displayFile = path.posix.join(
            'dictionaries',
            path.relative(dictionariesRoot, targetFile).split(path.sep).join('/'),
        );
        const dictionary = sections.file.split('/')[0];
        const words = parseWords(sections.words);
        const notes = parseNotes(sections['additional notes']);
        console.log(`file       = ${JSON.stringify(displayFile)}`);
        console.log(`dictionary = ${JSON.stringify(dictionary)}`);
        console.log(`words      = ${JSON.stringify(words)}`);
        console.log(`notes      = ${JSON.stringify(notes)}`);
        console.log(
            '(No file-disambiguation step needed - "git" has two source files, but the issue creator named the exact one.)',
        );

        section('3. Dictionary Updated - insert words (Phase 6)');
        const before = readFileSync(targetFile, 'utf8');
        const { content: after, added } = insertWords(before, words);
        writeFileSync(targetFile, after, 'utf8');
        console.log('--- before ---');
        console.log(before);
        console.log('--- after  ---');
        console.log(after);
        console.log(`(Phase 7 would now run "pnpm run prepare:dictionaries" to regenerate build artifacts.)`);

        section('4. PR Created (Phase 8)');
        const skipped = words.filter((w) => !added.includes(w));
        const branch = `issue-${ISSUE_NUMBER}`;
        const title = `fix: add words to ${dictionary} dictionary`;
        const body = formatPrBody({ issueNumber: ISSUE_NUMBER, dictionary, file: displayFile, added, skipped, notes });
        console.log(`branch: ${branch}`);
        console.log(`title:  ${title}`);
        console.log('body:');
        console.log(body);
    } finally {
        rmSync(tmpRoot, { recursive: true, force: true });
    }
}

main();
