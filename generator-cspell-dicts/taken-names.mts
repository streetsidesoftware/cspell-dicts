import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { readConfigFile, resolveConfigFileImports } from 'cspell-lib';

export interface TakenNames {
    /** Package name, lowercase, to the directory that uses it. */
    packages: Map<string, string>;
    /** Dictionary ID, lowercase, to the directory that uses it. */
    dictionaryIds: Map<string, string>;
}

/**
 * Read the package names and dictionary IDs already used in `dictionaries/`.
 */
export async function readTakenNames(dictionariesDir: string): Promise<TakenNames> {
    const packages = new Map<string, string>();
    const dictionaryIds = new Map<string, string>();

    for (const dir of readdirSync(dictionariesDir)) {
        const pkgFile = join(dictionariesDir, dir, 'package.json');
        if (!existsSync(pkgFile)) continue;
        const owner = `dictionaries/${dir}`;
        const pkg = JSON.parse(readFileSync(pkgFile, 'utf8'));
        packages.set(pkg.name.toLowerCase(), owner);

        const extFile = join(dictionariesDir, dir, 'cspell-ext.json');
        if (!existsSync(extFile)) continue;
        const configFile = await readConfigFile(pathToFileURL(extFile));
        // Only local imports: the bundle imports other dictionary packages.
        configFile.settings.import = [configFile.settings.import ?? []].flat().filter((i) => i.startsWith('./'));
        const settings = await resolveConfigFileImports(configFile);
        const definitions = [
            ...(settings.dictionaryDefinitions ?? []),
            ...(settings.languageSettings ?? []).flatMap((ls) => ls.dictionaryDefinitions ?? []),
        ];
        for (const def of definitions) {
            dictionaryIds.set(def.name.toLowerCase(), owner);
        }
    }

    return { packages, dictionaryIds };
}
