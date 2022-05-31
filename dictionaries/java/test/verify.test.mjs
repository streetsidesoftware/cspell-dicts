import { checkSnapshots } from 'cspell-dict-file-checker/index.mjs'

const testFiles = [
    'samples/**/*.java',
];

checkSnapshots(testFiles);
