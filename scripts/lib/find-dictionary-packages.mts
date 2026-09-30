import { globby } from 'globby';

const rootUrl = new URL('../../', import.meta.url);

/**
 * Find dictionary `package.json` files.
 * @param glob - optional glob pattern
 */
export function findDictionaryPackages(glob?: string): Promise<string[]> {
    glob ??= 'dictionaries/*/package.json';
    return globby(glob, { cwd: rootUrl, absolute: true });
}
