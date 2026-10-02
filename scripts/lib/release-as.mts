import fs from 'node:fs/promises';
import path from 'node:path';

import { configFile as configFileName, type PackageEntry } from './release-please.mts';

/**
 * Sets or removes `release-as` for packages in release-please-config.json.
 * @param rootDir - the repo root.
 * @param names - package names, such as `@cspell/dict-perl`.
 * @param version - the version to release, or `undefined` to remove `release-as`.
 */
export async function setReleaseAs(rootDir: string, names: string[], version: string | undefined): Promise<void> {
    const configFile = path.join(rootDir, configFileName);
    const config = JSON.parse(await fs.readFile(configFile, 'utf8'));
    const entries = Object.values(config.packages as Record<string, PackageEntry>);

    const unknown = names.filter((name) => !entries.some((e) => e.component === name));
    if (unknown.length) throw new Error(`Not in release-please-config.json: ${unknown.join(', ')}`);

    for (const entry of entries) {
        if (!names.includes(entry.component)) continue;
        if (version) {
            entry['release-as'] = version;
        } else {
            delete entry['release-as'];
        }
        console.log(`${entry.component}: ${version ? `release-as ${version}` : 'removed release-as'}`);
    }

    const text = JSON.stringify(config, undefined, 4) + '\n';
    await fs.writeFile(configFile, text);
}
