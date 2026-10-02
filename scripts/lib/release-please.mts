/** The Release Please config, relative to the repo root. */
export const configFile = 'release-please-config.json';

/** The Release Please manifest of released versions, relative to the repo root. */
export const manifestFile = '.release-please-manifest.json';

/** A package's entry in the config's `packages`. */
export interface PackageEntry {
    component: string;
    releaseType?: 'node';
    'release-as'?: string;
}
