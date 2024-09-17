// @ts-check
import assert from 'node:assert';

import { FlatpackStore } from '@cspell/normalize-json';

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

export const msPerDay = 24 * 60 * 60 * 1000;

export class PackageDependencies {
    version = 0;

    /**
     *
     * @param {Map<string, PackageInfo> | undefined} [packagesInfo]
     * @param {FlatpackStore} [flatpackStore]
     */
    constructor(packagesInfo, flatpackStore) {
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

        this.flatpackStore = flatpackStore || new FlatpackStore(packagesInfo);
    }

    toJSON() {
        this.flatpackStore.setValue(new Map(this.packagesInfo));
        return this.flatpackStore.toJSON();
    }

    stringify() {
        this.flatpackStore.setValue(new Map(this.packagesInfo));
        return this.flatpackStore.stringify();
    }

    static fromJSON(json) {
        // @ts-ignore
        if (!json || typeof json !== 'object') return new PackageDependencies();
        if (!Array.isArray(json)) {
            new PackageDependencies(new Map(Object.entries(json)));
        }
        const store = FlatpackStore.fromJSON(json);
        const packagesInfo = store.toValue();
        assert(isPackagesInfo(packagesInfo), 'Invalid PackageInfo');
        return new PackageDependencies(packagesInfo, store);
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
        info = info && { ...info };
        ++this.version;
        info = info || { ts: Date.now(), nf: true };
        // truncate the ts to the day.
        cleanTimestamp(info);
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
                if (typeof keyword !== 'string') continue;
                this.keywords.set(keyword, (this.keywords.get(keyword) || 0) + 1);
            }
        }
    }
}

/**
 *
 * @param {*} info
 * @returns {info is Map<string, PackageInfo>}
 */
function isPackagesInfo(info) {
    return info && typeof info === 'object' && info instanceof Map;
}

/**
 * To save on space, we truncate the timestamp to the day.
 * @param {PackageInfo} info
 * @returns
 */
export function cleanTimestamp(info) {
    info.ts = Math.floor(info.ts / msPerDay) * msPerDay;
}
