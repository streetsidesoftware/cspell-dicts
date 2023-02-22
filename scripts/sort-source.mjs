#!/usr/bin/env node

import { globby } from 'globby';
import { program } from 'commander';
import { promises as fs } from 'fs';

const compare = Intl.Collator('en-US').compare;

let info = console.log;

async function processFile(filename, options) {
    const content = await fs.readFile(filename, 'utf8');

    if (!content.trim()) return;

    const sorted = sortContent(content).replace(/^(.*\n)\1+/gm, '$1');

    if (sorted === content) {
        info(`${filename} - ok`);
        return;
    }

    // info(sorted);

    if (!options.dryRun) {
        await fs.writeFile(filename, sorted, 'utf8');
        info(`${filename} - updated`);
    } else {
        info(`${filename} - skipped --dry-run`);
    }
}

function sortContent(content) {
    const lines = content.split('\n');
    const groups = [[]];
    let group = 0;
    const noSortGroup = new Set();

    function addLineToGroup(line) {
        groups[group] = groups[group] || [''];
        groups[group].push(line.trim());
    }

    function addLine(line) {
        if (line.startsWith('#') && !noSortGroup.has(group)) {
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
        ignore: [...excludes, ...(options?.ignore || [])],
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
    .argument('[files...]', 'glob of files to read and sort.')
    .option('-c, --config <file>', 'Config file')
    .option('--dry-run', 'Dry Run mode')
    .option('-x, --exclude <patterns...>', 'Exclude pattern')
    .action(async (globs, options) => {
        // console.log('%o', options);
        const ignore = options.exclude || [];
        if (options.config) {
            const cfg = JSON.parse(await fs.readFile(options.config, 'utf8'));
            if (cfg.files) {
                globs.push(...cfg.files);
            }
            if (cfg.exclude) {
                ignore.push(...cfg.exclude);
            }
        }
        const files = (await findFiles(globs, { ignore })).filter(isAllowedFileType);
        console.log('%o', files);
        await Promise.all(files.map((file) => processFile(file, options)));
    });

program.parseAsync();
