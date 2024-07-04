import js from '@eslint/js';
import globals from 'globals';

export default [
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
            'no-unused-vars': [
                'error',
                {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                },
            ],
        },
    },
];
