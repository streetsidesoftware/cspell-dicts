import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, relative } from 'node:path';

import type { Settings } from './answers.mts';
import { title, toPackageName } from './names.mts';
import type { Repo } from './repo.mts';
import { isHunspellFile } from './hunspell.mts';
import { samplesConfig, sampleWords, samplesReadme, wordSample } from './samples.mts';
import { fillTemplate, templateDir, templateFiles } from './template.mts';
import { buildFiles, copies, publishedFiles, sourcesYaml, srcDir } from './sources.mts';
import { created as showCreated, info, literal } from './output.mts';

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

    const values: Record<string, string> = {
        name,
        friendlyName,
        description: answers.description,
        packageDescription: answers.packageDescription,
        locale: answers.locale,
        languageId: answers.languageId,
        packageName,
        fullPackageName: '@cspell/dict-' + packageName,
        sources: built.map(buildSource).join('\n      - '),
        excludeWordsFrom: answers.excludeWords ? `['${excludeWordsFile}']` : '[]',
        dstFullFileName: dstFileName,
        format: useTrie ? 'trie3' : 'plaintext',
        generateNonStrict: useTrie ? 'true' : 'false',
        prepareScript: built.some((file) => isHunspellFile(file)) ? 'echo OK' : 'pnpm run build',
        prepublishOnlyScript: 'echo OK',
        year: String(new Date().getFullYear()),
    };

    info('Creating %s', literal(relative(rootDir, packageDir)));
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
    for (const sample of answers.samples) {
        const file = join('samples', sample.name);
        if (sample.from) copyFileSync(sample.from, created(file));
        else write(file, sample.text ?? '');
    }
    write('samples/README.md', samplesReadme(title(friendlyName), answers.samples));
    write('samples/cspell.json', JSON.stringify(samplesConfig(answers.locale, answers.languageId), null, 4) + '\n');
    const words = sampleWords(built.map((file) => join(packageDir, file)));
    write(join('samples', wordSample), words.map((word) => word + '\n').join(''));
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
        const name = `filename: '${filename.replaceAll("'", "''")}'`;
        if (!isHunspellFile(filename)) return name;
        return [
            name,
            '        # How many affix rules to chain onto a word. Higher adds word forms,',
            '        # but can make the build very slow or run out of memory.',
            `        maxDepth: ${answers.hunspellDepth}`,
        ].join('\n');
    }

    function created(file: string): string {
        const path = join(packageDir, file);
        mkdirSync(dirname(path), { recursive: true });
        showCreated(relative(rootDir, path));
        return path;
    }

    function write(file: string, content: string): void {
        writeFileSync(created(file), content);
    }
}
