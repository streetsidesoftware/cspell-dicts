// @ts-check
import test from 'ava';
import { checkText } from 'cspell';
import { glob } from 'glob';

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
 * @param {import("cspell").CheckTextResult } result
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
