import { checkSnapshots } from '../check.mjs'

const testFiles = [
    'samples/issue-1097.tex',
    'samples/papers/**/*.tex',
];

checkSnapshots(testFiles);
