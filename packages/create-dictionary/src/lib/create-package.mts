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

    // The test script reads the first source until samples replace it.
    const first = answers.sources[0];
    const firstIsHunspell = isHunspellFile(first.file);

    const values: Record<string, string> = {
        name,
        friendlyName,
        description: answers.description,
        packageDescription: answers.packageDescription,
        locale: answers.locale,
        languageId: answers.languageId,
        packageName,
        fullPackageName: '@cspell/dict-' + packageName,
        srcFile: 'src/' + basename(first.file),
        sources: answers.sources.map((source) => buildSource('src/' + basename(source.file))).join('\n      - '),
        dstFullFileName: dstFileName,
        format: useTrie ? 'trie3' : 'plaintext',
        generateNonStrict: useTrie ? 'true' : 'false',
        srcFileReader: firstIsHunspell ? 'hunspell-reader words -n 1000 -m 0' : 'head -n 1000',
        prepareScript: answers.sources.some((source) => isHunspellFile(source.file)) ? 'echo OK' : 'pnpm run build',
        prepublishOnlyScript: 'echo OK',
        year: String(new Date().getFullYear()),
    };

    console.log('Creating ' + relative(rootDir, packageDir));
    for (const file of templateFiles) {
        const template = readFileSync(join(templateDir, file), 'utf8');
        const content = fillTemplate(template, values, extname(file));
        write(file, file === 'package.json' ? withContributors(content, answers.contributors) : content);
    }
    for (const source of answers.sources) {
        if (source.empty) {
            write(join('src', basename(source.file)), `# ${title(friendlyName)} Terms\n`);
            continue;
        }
        const file = resolve(cwd, source.file);
        for (const copy of isHunspellFile(file) ? hunspellPair(file) : [file]) {
            copyFileSync(copy, created(join('src', basename(copy))));
        }
    }
    write(dstFileName, '# dest');

    return packageDir;

    function withContributors(packageJson: string, contributors: string[]): string {
        const pkg = JSON.parse(packageJson);
        pkg.contributors = contributors;
        return JSON.stringify(pkg, null, 2) + '\n';
    }

    /** A source in cspell-tools.config.yaml: the template has the first item's "- ", and the join adds the rest. */
    function buildSource(filename: string): string {
        return [
            `filename: '${filename.replaceAll("'", "''")}'`,
            '        maxDepth: 1 # This is set to 1 to prevent initial builds from taking too long.',
        ].join('\n');
    }

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
