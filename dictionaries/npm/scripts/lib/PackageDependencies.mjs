import { toJSON, fromJSON } from '@cspell/normalize-json';

/**
 * @typedef {{ ts: number, dependencies?: string[] | undefined, devDependencies?: string[] | undefined, nf?: true }} PackageInfo
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
     * @param {PackageInfo | undefined} info
     */
    set(packageName, info) {
        ++this.version;
        info = info || { ts: Date.now(), nf: true };
        this.packagesInfo.set(packageName, info);
    }

    get size() {
        return this.packagesInfo.size;
    }
}
