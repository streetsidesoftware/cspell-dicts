import { fileURLToPath } from 'node:url';

export const templateDir = fileURLToPath(new URL('../../templates/', import.meta.url));

/** The template files, relative to `templateDir` and to the new package. */
export const templateFiles = [
    'package.json',
    'README.md',
    'cspell-ext.json',
    'cspell.json',
    'LICENSE',
    'cspell-tools.config.yaml',
    'dict/README.md',
    'src/README.md',
];

/**
 * Replace each `<%= key %>` with its value, escaped for the file type, and each `<%- key %>` with its value as it is.
 */
export function fillTemplate(template: string, values: Record<string, string>, ext: string): string {
    return template.replaceAll(/<%([=-]) (\w+) %>/g, (_, kind: string, key: string) => {
        const value = values[key];
        if (value === undefined) throw new Error(`Unknown template value: ${key}`);
        if (kind === '-') return value;
        if (ext === '.json') return JSON.stringify(value).slice(1, -1);
        if (ext === '.yaml') return value.replaceAll("'", "''");
        return value;
    });
}
