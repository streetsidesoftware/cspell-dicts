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
];
