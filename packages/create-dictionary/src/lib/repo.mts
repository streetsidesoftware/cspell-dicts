import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import { readConfigFile, resolveConfigFileImports } from 'cspell-lib';

export interface Repo {
    rootDir: string;
    dictionariesDir: string;
}

/**
 * The repo at `rootDir`, which must have a `dictionaries` folder.
 */
export function openRepo(rootDir: string): Repo {
    const dictionariesDir = join(rootDir, 'dictionaries');
    if (!existsSync(dictionariesDir)) throw new Error(`no dictionaries folder in ${rootDir}`);
    return { rootDir, dictionariesDir };
}

/** `git config user.name`, or `undefined` when it isn't set. */
export function gitUserName(cwd: string): string | undefined {
    const result = spawnSync('git', ['config', 'user.name'], { cwd, encoding: 'utf8' });
    return result.status === 0 ? result.stdout.trim() || undefined : undefined;
}

/**
 * The nearest folder above `dir` that has `.git`: a directory, or a file in a git worktree.
 */
export function findRepoRoot(dir: string): string {
    for (let current = resolve(dir); ; current = dirname(current)) {
        if (existsSync(join(current, '.git'))) return current;
        if (dirname(current) === current) throw new Error(`no git repository found above ${resolve(dir)}`);
    }
}

export interface TakenNames {
    /** Package name, lowercase, to the directory that uses it. */
    packages: Map<string, string>;
    /** Dictionary ID, lowercase, to the directory that uses it. */
    dictionaryIds: Map<string, string>;
}

/**
 * Read the package names and dictionary IDs already used in `dictionaries/`.
 */
export async function readTakenNames({ dictionariesDir }: Repo): Promise<TakenNames> {
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
