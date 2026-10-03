import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, join, relative, resolve } from 'node:path';

import type { Settings } from './answers.mts';
import { title, toPackageName } from './names.mts';
import type { Repo } from './repo.mts';
import { hunspellPair, isHunspellFile } from './source.mts';
import { fillTemplate, templateDir, templateFiles } from './template.mts';

/**
 * Write the new package from the templates and the source. Returns its directory.
 */
export function createPackage(answers: Settings, repo: Repo, cwd: string): string {
    const { name, friendlyName, useTrie } = answers;
    const { rootDir } = repo;
    const packageDir = join(repo.dictionariesDir, name);
    const packageName = toPackageName(name);
    const dstFileName = `dict/${packageName}.${useTrie ? 'trie' : 'txt'}`;

    const srcFile = resolve(cwd, answers.srcFile);
    const isHunspell = isHunspellFile(srcFile);

    const values: Record<string, string> = {
        name,
        friendlyName,
        description: answers.description,
        locale: answers.locale,
        languageId: answers.languageId,
        packageName,
        fullPackageName: '@cspell/dict-' + packageName,
        srcFile: 'src/' + basename(srcFile),
        dstFullFileName: dstFileName,
        format: useTrie ? 'trie3' : 'plaintext',
        generateNonStrict: useTrie ? 'true' : 'false',
        srcFileReader: isHunspell ? 'hunspell-reader words -n 1000 -m 0' : 'head -n 1000',
        prepareScript: isHunspell ? 'echo OK' : 'pnpm run build',
        prepublishOnlyScript: 'echo OK',
        year: String(new Date().getFullYear()),
    };

    console.log('Creating ' + relative(rootDir, packageDir));
    for (const file of templateFiles) {
        const template = readFileSync(join(templateDir, file), 'utf8');
        write(file, fillTemplate(template, values, extname(file)));
    }
    if (answers.emptySource) {
        write(values.srcFile, `# ${title(friendlyName)} Terms\n`);
    } else {
        for (const file of isHunspell ? hunspellPair(srcFile) : [srcFile]) {
            copyFileSync(file, created(join('src', basename(file))));
        }
    }
    write(dstFileName, '# dest');

    return packageDir;

    function created(file: string): string {
        const path = join(packageDir, file);
        mkdirSync(dirname(path), { recursive: true });
        console.log('   create ' + relative(rootDir, path));
        return path;
    }

    function write(file: string, content: string): void {
        writeFileSync(created(file), content);
    }
}
