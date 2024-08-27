// @ts-check
/**
 *
 * @param {string} packageName
 * @returns {Promise<{ dependencies: string[]; devDependencies: string[] } | undefined>}
 */
export async function getPackageDependencies(packageName) {
    const response = await fetch(`https://registry.npmjs.org/${packageName}/latest`);
    if (!response.ok) {
        return undefined;
    }
    const regExpPossibleSemVer = /^[=~^]?\d/;
    const { dependencies = {}, devDependencies = {} } = await response.json();
    // const p = Object.entries(devDependencies).filter(([_, value]) => !regExpPossibleSemVer.test(value));
    // if (p.length > 0) console.warn('Private deps: %o', p);
    return {
        dependencies: Object.keys(dependencies),
        devDependencies: Object.entries(devDependencies)
            .filter(([_, value]) => regExpPossibleSemVer.test(value))
            .map(([key]) => key),
    };
}
