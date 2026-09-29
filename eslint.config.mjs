import js from '@eslint/js';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

const tsFiles = ['**/*.ts', '**/*.mts', '**/*.cts'];

const noUnusedVarsOptions = {
    args: 'all',
    argsIgnorePattern: '^_',
    caughtErrors: 'all',
    caughtErrorsIgnorePattern: '^_',
    destructuredArrayIgnorePattern: '^_',
    varsIgnorePattern: '^_',
    ignoreRestSiblings: true,
};

export default [
    // Synced upstream type definitions, such as dictionaries/*/src/hunspell/index.d.ts.
    { ignores: ['.claude/worktrees/**', 'dictionaries/*/src/**/*.d.ts'] },
    js.configs.recommended,
    {
        languageOptions: {
            parserOptions: {
                sourceType: 'module',
            },
            globals: {
                ...globals.node,
            },
        },
    },
    {
        files: ['**/__tests__/**'],
        languageOptions: {
            globals: {
                ...globals.jest,
            },
        },
    },
    {
        rules: {
            // Note: you must disable the base rule as it can report incorrect errors
            'no-unused-vars': ['error', noUnusedVarsOptions],
        },
    },
    ...tsEslint.configs.recommended.map((config) => ({ ...config, files: tsFiles })),
    {
        files: tsFiles,
        rules: {
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': ['error', noUnusedVarsOptions],
        },
    },
];
