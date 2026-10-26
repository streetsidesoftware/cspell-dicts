import fs from 'node:fs/promises';
import path from 'node:path';

import { format } from 'prettier';

import { findDictionaryPackages } from './find-dictionary-packages.mts';
import { configFile, type PackageEntry } from './release-please.mts';

/**
 * Each package's publication state, relative to the repo root: `{ "trustedPublishing": false }` while it waits for
 * publication, `true` once it trusts the publish workflow, and `false` instead of an entry for a package never to
 * publish. A private dictionary without an entry is waiting for its publication PR.
 */
export const publishedFile = 'static/published.json';

export const privateSuffix = /\s*--\s*Private until verified\s*$/;

export interface PublishedEntry {
    trustedPublishing?: boolean;
}

export type Published = Record<string, PublishedEntry | false>;

export async function readPublished(rootDir: string): Promise<Published> {
    return fs.readFile(path.join(rootDir, publishedFile), 'utf8').then(JSON.parse, () => ({}));
}

export async function writePublished(rootDir: string, published: Published): Promise<void> {
    const file = path.join(rootDir, publishedFile);
    const sorted = Object.fromEntries(Object.entries(published).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
    await fs.writeFile(file, await format(JSON.stringify(sorted), { filepath: file }));
}

/** A copy of `published` with `name`'s `trustedPublishing` set. */
export function recordTrusted(published: Published, name: string, trusted: boolean): Published {
    const entry = published[name];
    if (entry === false) throw new Error(`${publishedFile} marks ${name} as never to be published.`);
    return { ...published, [name]: { ...entry, trustedPublishing: trusted } };
}

/** A copy of `published` with `name` waiting for publication, unless it already has an entry. */
export function recordPending(published: Published, name: string): Published {
    return name in published ? published : { ...published, [name]: { trustedPublishing: false } };
}

export interface PublicationVersions {
    /** The version Release Please releases, and CI publishes, once the publication PR is merged. */
    releaseAs: string;
    /** The version the maintainer publishes by hand, under the npm `alpha` tag. */
    version: string;
}

/**
 * A dictionary at a version below 1.0.0 is released as 1.0.0. One that Release Please already released while private,
 * such as 1.0.3, is released at the next minor version, so its tags don't collide. The hand-published version is
 * always a prerelease.
 */
export function publicationVersions(current: string): PublicationVersions {
    const match = /^(\d+)\.(\d+)\.\d+/.exec(current);
    if (!match) throw new Error(`Not a version: ${current}`);
    const [, major, minor] = match.map(Number);
    const releaseAs = major >= 1 ? `${major}.${minor + 1}.0` : '1.0.0';
    const version = current.includes('-') ? current : `${releaseAs}-alpha.0`;
    return { releaseAs, version };
}

export interface DictionaryPackage {
    /** Directory under `dictionaries/`, such as `perl`. */
    dir: string;
    name: string;
    version: string;
    private?: boolean;
}

export interface PublicationCandidate extends PublicationVersions {
    dir: string;
    name: string;
}

export async function readDictionaryPackages(): Promise<DictionaryPackage[]> {
    const packages: DictionaryPackage[] = [];
    for (const file of await findDictionaryPackages()) {
        const pkg = JSON.parse(await fs.readFile(file, 'utf8'));
        packages.push({
            dir: path.basename(path.dirname(file)),
            name: pkg.name,
            version: pkg.version,
            private: pkg.private,
        });
    }
    return packages;
}

/** The branch of a dictionary's publication PR. */
export function publicationBranch(dir: string): string {
    return `prepare-publication-${dir}`;
}

/**
 * Private dictionaries waiting for publication: each one that `published` doesn't mark `false`, and that is in
 * release-please-config.json, since its PR sets `release-as` there.
 */
export function publicationCandidates(
    packages: DictionaryPackage[],
    published: Published,
    released: string[],
): PublicationCandidate[] {
    return packages
        .filter((p) => p.private && published[p.name] !== false && released.includes(p.name))
        .map((p) => ({ dir: p.dir, name: p.name, ...publicationVersions(p.version) }));
}

/** The components in release-please-config.json. */
export async function readReleaseComponents(rootDir: string): Promise<string[]> {
    const config = JSON.parse(await fs.readFile(path.join(rootDir, configFile), 'utf8'));
    return Object.values(config.packages as Record<string, PackageEntry>).map((e) => e.component);
}
