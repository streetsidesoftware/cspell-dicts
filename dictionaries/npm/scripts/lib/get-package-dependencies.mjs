// @ts-check

/**
 * NPM Registry API
 * See: https://github.com/npm/registry/blob/main/docs/REGISTRY-API.md#endpoints
 */

/**
 *
 * @param {string} packageName
 * @returns {Promise<{ dependencies: string[]; devDependencies: string[]; keywords: string[] } | undefined>}
 */
export async function getPackageDependencies(packageName) {
    const response = await fetch(`https://registry.npmjs.org/${packageName}/latest`);
    if (!response.ok) {
        return undefined;
    }
    const regExpPossibleSemVer = /^[=~^]?\d/;
    const { dependencies = {}, devDependencies = {}, keywords = [] } = await response.json();
    // const p = Object.entries(devDependencies).filter(([_, value]) => !regExpPossibleSemVer.test(value));
    // if (p.length > 0) console.warn('Private deps: %o', p);
    return {
        dependencies: Object.keys(dependencies),
        devDependencies: Object.entries(devDependencies)
            .filter(([_, value]) => regExpPossibleSemVer.test(value))
            .map(([key]) => key),
        keywords: Array.isArray(keywords) ? keywords.filter((a) => typeof a === 'string') : [],
    };
}

export const commonKeywords = [
    'backend',
    'cli',
    'css',
    'documentation',
    'framework',
    'front-ent',
    'frontend',
    'html',
    'mobile',
    'react',
    'testing',
];

const defaultSize = 50;

export async function searchForPackagesByKeyword(...keywords) {
    const url = new URL('https://registry.npmjs.org/-/v1/search');
    const text = ['keywords:' + keywords.join(','), 'not:insecure'].join(' ');
    url.searchParams.set('text', text);
    url.searchParams.set('size', defaultSize.toString());
    url.searchParams.set('popularity', '1.0');
    url.searchParams.set('quality', '0.75');
    url.searchParams.set('maintenance', '0.75');
    const response = await fetch(url);
    if (!response.ok) {
        return [];
    }
    /**
     * @typedef {{ package: { name: string }}} PackageObject
     * @typedef {{ objects: PackageObject[] }} SearchResult
     */
    /** @type {SearchResult} */
    const result = await response.json();
    const { objects = [] } = result;
    return objects.map((o) => o.package.name);
}
