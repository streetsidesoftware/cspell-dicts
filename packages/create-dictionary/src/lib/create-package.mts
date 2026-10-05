import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, relative } from 'node:path';

import type { Settings } from './answers.mts';
import { title, toPackageName } from './names.mts';
import type { Repo } from './repo.mts';
import { isHunspellFile } from './hunspell.mts';
import { fillTemplate, templateDir, templateFiles } from './template.mts';
import { buildFiles, copies, publishedFiles, sourcesYaml, srcDir } from './sources.mts';

const additionalWordsFile = 'src/additional_words.txt';
const excludeWordsFile = 'src/exclude_words.txt';

/**
 * Write the new package from the templates and the source. Returns its directory.
 */
export function createPackage(answers: Settings, repo: Repo): string {
    const { name, friendlyName, useTrie } = answers;
    const { rootDir } = repo;
    const packageDir = join(repo.dictionariesDir, name);
    const packageName = toPackageName(name);
    const dstFileName = `dict/${packageName}.${useTrie ? 'trie' : 'txt'}`;

    const built = [...answers.sources.flatMap(buildFiles), ...(answers.additionalWords ? [additionalWordsFile] : [])];
    // The test script reads the first source until samples replace it.
    const first = built[0];

    const values: Record<string, string> = {
        name,
        friendlyName,
        description: answers.description,
        packageDescription: answers.packageDescription,
        locale: answers.locale,
        languageId: answers.languageId,
        packageName,
        fullPackageName: '@cspell/dict-' + packageName,
        srcFile: first,
        sources: built.map(buildSource).join('\n      - '),
        excludeWordsFrom: answers.excludeWords ? `['${excludeWordsFile}']` : '[]',
        dstFullFileName: dstFileName,
        format: useTrie ? 'trie3' : 'plaintext',
        generateNonStrict: useTrie ? 'true' : 'false',
        srcFileReader: isHunspellFile(first) ? 'hunspell-reader words -n 1000 -m 0' : 'head -n 1000',
        prepareScript: built.some((file) => isHunspellFile(file)) ? 'echo OK' : 'pnpm run build',
        prepublishOnlyScript: 'echo OK',
        year: String(new Date().getFullYear()),
    };

    console.log('Creating ' + relative(rootDir, packageDir));
    for (const file of templateFiles) {
        const template = readFileSync(join(templateDir, file), 'utf8');
        const content = fillTemplate(template, values, extname(file));
        write(file, file === 'package.json' ? withPeopleAndKeywords(content) : content);
    }
    for (const source of answers.sources) {
        for (const file of source.files) {
            if (file.empty) write(srcDir(source) + file.local, `# ${title(friendlyName)} Terms\n`);
        }
    }
    for (const { from, to } of answers.sources.flatMap(copies)) copyFileSync(from, created(to));
    if (answers.sources.some((source) => source.name)) write('src/sources.yaml', sourcesYaml(answers.sources));
    if (answers.additionalWords) {
        write(additionalWordsFile, '# Words to add that the sources lack. One per line; see docs/word-lists.md.\n');
    }
    if (answers.excludeWords) {
        write(
            excludeWordsFile,
            '# Words to leave out of the built dictionary. One per line; see docs/word-lists.md.\n',
        );
    }
    write(dstFileName, '# dest');

    return packageDir;

    /** The template's package.json, with the contributors, the extra keywords, and the sources' licenses and READMEs. */
    function withPeopleAndKeywords(packageJson: string): string {
        const pkg = JSON.parse(packageJson);
        pkg.contributors = answers.contributors;
        pkg.keywords = [...new Set([...pkg.keywords, ...answers.keywords])];
        pkg.files = [...pkg.files, ...answers.sources.flatMap(publishedFiles)];
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
