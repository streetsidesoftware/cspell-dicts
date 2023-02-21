#!/usr/bin/env node

import { globby } from 'globby';
import { program } from 'commander';
import { promises as fs } from 'fs';

const compare = Intl.Collator('en-US').compare;

let info = console.log;

async function processFile(filename, options) {
    info(`Reading ${filename}`);
    const content = await fs.readFile(filename, 'utf8');

    const sorted = sortContent(content).replace(/^(.*\n)\1+/gm, '$1');

    if (sorted === content) {
        info('ok');
        return;
    }

    // info(sorted);

    !options.dryRun && (await fs.writeFile(filename, sorted, 'utf8'));
}

function sortContent(content) {
    const lines = content.split('\n');
    const groups = [[]];
    let group = 0;
    const noSortGroup = new Set();

    function addLineToGroup(line) {
        groups[group] = groups[group] || [];
        groups[group].push(line);
    }

    function addLine(line) {
        if (line.startsWith('#')) {
            ++group;
            noSortGroup.add(group);
        }
        addLineToGroup(line);
    }

    for (const line of lines) {
        addLine(line);
    }

    groups.forEach((group, idx) => (noSortGroup.has(idx) ? group : group.sort(compare)));

    return (
        groups
            .flatMap((a) => a)
            .join('\n')
            .trim() + '\n'
    );
}

function isAllowedFileType(filename) {
    return filename.endsWith('.txt') && /src[/\\].*\.txt$/.test(filename);
}

const excludes = ['node_modules'];

async function findFiles(globs, options) {
    const globOptions = {
        ignore: [...excludes, ...(options?.exclude || [])],
        onlyFiles: options?.onlyFiles ?? true,
        cwd: options?.cwd || process.cwd(),
    };
    const files = await globby(
        globs.map((a) => a.trim()).filter((a) => !!a),
        globOptions
    );
    return files;
}

program
    .name('sort-source')
    .description('Sort the content of source files.')
    .argument('<files...>', 'glob of files to read and sort.')
    .option('--dry-run', 'Dry Run mode')
    .option('-x, --exclude <patterns...>', 'Exclude pattern')
    .action(async (globs, options) => {
        console.log('%o', options);
        const files = (await findFiles(globs, options)).filter(isAllowedFileType);
        console.log('%o', files);
        await Promise.all(files.map((file) => processFile(file, options)));
    });

program.parseAsync();
