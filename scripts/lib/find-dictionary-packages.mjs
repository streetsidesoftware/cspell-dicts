import { globby } from 'globby';

const rootUrl = new URL('../../', import.meta.url);

/**
 * Find dictionary `package.json` files.
 * @param {string} [glob] - optional glob pattern
 * @returns {Promise<string[]>}
 */
export function findDictionaryPackages(glob) {
    glob ??= 'dictionaries/*/package.json';
    return globby(glob, { cwd: rootUrl, absolute: true });
}
