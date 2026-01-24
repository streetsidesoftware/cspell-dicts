// @ts-check
import test from 'ava';
import { checkText } from 'cspell';
import { spellCheckFile } from 'cspell-lib';
import { glob } from 'glob';

/**
 * @typedef { import("cspell-lib").ValidationIssue } ValidationIssue
 */

/**
 *
 * @param {number | string} val
 * @param {number} n
 * @returns {string}
 */
function rightJustify(val, n = 5) {
    return val.toString().padStart(n, ' ');
}

/**
 * @param { import("cspell").CheckTextResult } result
 */
function formatResult(result) {
    return result.items.map(
        (seg) =>
            `${seg.flagIE} ${seg.isError ? '!' : '_'} ${rightJustify(seg.startPos)}-${rightJustify(seg.endPos)} | ${
                seg.text
            }`,
    );
}

/**
 * @param {string[]} fileGlobsToCheck
 */
export function checkSnapshots(fileGlobsToCheck) {
    for (const fileGlob of fileGlobsToCheck) {
        const globs = glob.sync(fileGlob);

        globs.forEach((filename) => {
            filename = filename.replace(/\\/g, '/');
            test(`verify ${filename} against snapshot`, async (t) => {
                const result = await checkText(filename, {});
                t.snapshot(formatResult(result));
            });
        });
    }
}

/**
 * @typedef { { text: string, line: number, col: number } } Issue
 */

/**
 *
 * @param {string} text
 * @param {ValidationIssue[]} issues
 * @return { Issue[] }
 */
function formatValidationIssues(text, issues) {
    issues.sort((a, b) => a.offset - b.offset);

    /** @type { Issue[] } */
    const results = [];

    let line = 1;
    let lineStart = 0;
    let j = 0;

    for (let i = 0; i < text.length && j < issues.length; i++) {
        if (text[i] === '\n') {
            line++;
            lineStart = i + 1;
        }
        while (j < issues.length && issues[j].offset === i) {
            results.push({ text: issues[j].text, line, col: i - lineStart + 1 });
            j++;
        }
    }

    return results;
}

/**
 * @param {string[]} fileGlobsToCheck
 */
export function spellcheckFilesAgainstSnapshot(fileGlobsToCheck) {
    for (const fileGlob of fileGlobsToCheck) {
        const globs = glob.sync(fileGlob);

        globs.forEach((filename) => {
            filename = filename.replace(/\\/g, '/');
            test(`Spell check ${filename} issues against snapshot`, async (t) => {
                const result = await spellCheckFile(filename, {}, {});
                const text = result.document.text || '';
                t.snapshot(formatValidationIssues(text, result.issues));
            });
        });
    }
}
