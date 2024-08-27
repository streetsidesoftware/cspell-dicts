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
    const { dependencies, devDependencies } = await response.json();
    return {
        dependencies: Object.keys({ ...dependencies }),
        devDependencies: Object.keys({ ...devDependencies }),
    };
}
