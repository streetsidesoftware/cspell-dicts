#!/usr/bin/env node

// Local, offline demo of the issue-to-pr proof-of-concept pipeline.
//
//   Issue Created -> Workflow Runs -> Dictionary Updated -> PR Created
//
// This runs the *same* phase 4-8 logic the workflow uses
// (.github/workflows/issue-to-pr.yml), against a throwaway fixture
// dictionary under a temp directory, so it never touches real files in
// `dictionaries/`. It does not call the GitHub API - the "PR Created"
// phase just prints what would be sent to `peter-evans/create-pull-request`.
//
// Run with: node scripts/issue-to-pr/demo.mjs

import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { parseIssueForm, parseWords, validateDictionary } from './parse-issue.mjs';
import { findDictionaryFile } from './find-dictionary-file.mjs';
import { insertWords } from './insert-words.mjs';
import { formatPrBody } from './format-pr-body.mjs';

const ISSUE_NUMBER = '123';
// "fetch" is deliberately also one of the fixture's pre-existing words below,
// to demonstrate the "already present, skipped" path alongside genuinely new words.
const ISSUE_BODY = `### Dictionary

git

### Words

push
pull
github
fetch
`;

function section(title) {
    console.log(`\n=== ${title} ===`);
}

function main() {
    const tmpRoot = mkdtempSync(path.join(tmpdir(), 'issue-to-pr-demo-'));
    const dictionariesRoot = path.join(tmpRoot, 'dictionaries');
    const srcDir = path.join(dictionariesRoot, 'git', 'src');
    mkdirSync(srcDir, { recursive: true });
    const fixtureFile = path.join(srcDir, 'git.txt');
    writeFileSync(
        fixtureFile,
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

    try {
        section('1. Issue Created');
        console.log(`Issue #${ISSUE_NUMBER} opened using the "Add Words to a Dictionary" form:\n`);
        console.log(ISSUE_BODY);

        section('2. Workflow Runs - parse issue (Phase 4)');
        const sections = parseIssueForm(ISSUE_BODY);
        validateDictionary(sections.dictionary, dictionariesRoot);
        const words = parseWords(sections.words);
        console.log(`dictionary = ${JSON.stringify(sections.dictionary)}`);
        console.log(`words      = ${JSON.stringify(words)}`);

        section('3. Workflow Runs - locate dictionary file (Phase 5)');
        const targetFile = findDictionaryFile(sections.dictionary, dictionariesRoot);
        console.log(`target file = ${targetFile}`);

        section('4. Dictionary Updated - insert words (Phase 6)');
        const before = readFileSync(targetFile, 'utf8');
        const { content: after, added } = insertWords(before, words);
        writeFileSync(targetFile, after, 'utf8');
        console.log('--- before ---');
        console.log(before);
        console.log('--- after  ---');
        console.log(after);
        console.log(`(Phase 7 would now run "pnpm run prepare:dictionaries" to regenerate build artifacts.)`);

        section('5. PR Created (Phase 8)');
        const skipped = words.filter((w) => !added.includes(w));
        const branch = `issue-${ISSUE_NUMBER}`;
        const title = `fix: add words to ${sections.dictionary} dictionary`;
        const body = formatPrBody({ issueNumber: ISSUE_NUMBER, dictionary: sections.dictionary, added, skipped });
        console.log(`branch: ${branch}`);
        console.log(`title:  ${title}`);
        console.log('body:');
        console.log(body);
    } finally {
        rmSync(tmpRoot, { recursive: true, force: true });
    }
}

main();
