import { checkSnapshots } from 'cspell-dict-file-checker/index.mjs';

const testFiles = [
    'samples/issue-1097.tex',
    'samples/papers/**/*.tex',
    'samples/issue-627.tex',
    'samples/issue-754.tex',
    'samples/issue-5291.tex',
];

checkSnapshots(testFiles);
