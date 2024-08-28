import { toJSON, fromJSON } from '@cspell/normalize-json';

/**
 * @typedef {{
 *  ts: number;
 *  dependencies?: string[] | undefined;
 *  devDependencies?: string[] | undefined;
 *  keywords?: string[] | undefined;
 *  nf?: true
 * }} PackageInfo
 * @typedef {{[key: string]: PackageInfo }} PackagesInfo
 */

export class PackageDependencies {
    version = 0;

    /**
     *
     * @param {Map<string, PackageInfo> | undefined} [packagesInfo]
     */
    constructor(packagesInfo) {
        /**
         * @type {Map<string, PackageInfo>}
         */
        this.packagesInfo = packagesInfo || new Map();
        /**
         * @type {Map<string, number>}
         */
        this.packageRefCounts = new Map();

        /**
         * @type {Map<string, number>}
         */
        this.keywords = new Map();

        this.calcRefCounts();
    }

    toJSON() {
        return toJSON(this.packagesInfo);
    }

    static fromJSON(json) {
        // @ts-ignore
        if (!json || typeof json !== 'object') return new PackageDependencies();
        return Array.isArray(json)
            ? new PackageDependencies(fromJSON(json))
            : new PackageDependencies(new Map(Object.entries(json)));
    }

    /**
     *
     * @param {string} packageName
     * @returns {PackageInfo | undefined}
     */
    get(packageName) {
        const info = this.packagesInfo.get(packageName);
        if (!info) return undefined;
        if (info.nf) return undefined;
        return info;
    }

    /**
     *
     * @param {string} packageName
     * @returns {boolean} Returns true if the package is found and referenced.
     */
    has(packageName) {
        return this.packagesInfo.has(packageName);
    }

    /**
     * Get the number of references to the package.
     * @param {string} packageName
     * @param {boolean} [zeroNotFound] Return zero if the package is not found in the registry.
     * @returns {number} Returns the number of references to the package, 0 if the package is not found or referenced.
     */
    getRefCount(packageName, zeroNotFound = true) {
        if (zeroNotFound && !this.get(packageName)) return 0;
        return this.packageRefCounts.get(packageName) || 0;
    }

    /**
     *
     * @param {string} packageName
     * @param {PackageInfo | undefined} info
     */
    set(packageName, info) {
        ++this.version;
        info = info || { ts: Date.now(), nf: true };
        this.packagesInfo.set(packageName, info);
        this.calcRefCounts();
    }

    get size() {
        return this.packagesInfo.size;
    }

    /**
     * Calculate the reference counts for the packages.
     */
    calcRefCounts() {
        this.packageRefCounts.clear();
        this.keywords.clear();
        for (const [, { dependencies = [], devDependencies = [], keywords = [] }] of this.packagesInfo) {
            for (const dep of [...dependencies, ...devDependencies]) {
                this.packageRefCounts.set(dep, (this.packageRefCounts.get(dep) || 0) + 1);
            }
            for (const keyword of keywords) {
                this.keywords.set(keyword, (this.keywords.get(keyword) || 0) + 1);
            }
        }
    }
}
