import test from 'ava';
import { checkText } from 'cspell';
import glob from 'glob';

function rightJustify(val, n = 5) {
    val = val.toString();
    return ' '.repeat(Math.max(0, n - val.length)) + val;
}

/**
 * @param {import("cspell").CheckTextResult } result
 */
function formatResult(result) {
    return result.items.map(seg => `${seg.flagIE} ${seg.isError ? '!' : '_'} ${rightJustify(seg.startPos)}-${rightJustify(seg.endPos)} | ${seg.text}`)
}

/**
 * @param {string[]} fileGlobsToCheck
 */
export function checkSnapshots(fileGlobsToCheck) {
    for (const fileGlob of fileGlobsToCheck) {
        const globs = glob.sync(fileGlob);

        globs.forEach(filename => {
            test(`verify ${filename} against snapshot`, async (t) => {
                const result = await checkText(filename, {});
                t.snapshot(formatResult(result));
            })
        })
    }
}
