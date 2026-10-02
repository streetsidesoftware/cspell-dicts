import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * The name of the package in the current folder, when it is a package in this repo, such as `dictionaries/perl`.
 * @param rootDir - the repo root.
 */
export async function currentPackageName(rootDir: string): Promise<string | undefined> {
    const dir = process.cwd();
    const relative = path.relative(rootDir, dir);
    if (!/^(dictionaries|packages)[/\\][^/\\]+$/.test(relative)) return undefined;
    const pkg = await fs.readFile(path.join(dir, 'package.json'), 'utf8').then(JSON.parse, () => undefined);
    return pkg?.name;
}
