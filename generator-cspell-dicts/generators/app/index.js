import Generator from 'yeoman-generator';
import chalk from 'chalk';
import yosay from 'yosay';
import { extname, resolve, join, dirname, basename } from 'path';
import { mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

import { optionForAnswer } from './options.mts';

function mkdirp(p) {
    return mkdir(p, { recursive: true });
}

const dictionaryDir = 'dictionaries';

export default class extends Generator {
    async prompting() {
        const props = await this._ask([
            {
                type: 'input',
                name: 'name',
                message: 'The package directory name (en_US, medical-terms)',
                validate: validateName,
            },
            {
                type: 'input',
                name: 'friendlyName',
                message: 'Friendly Name ("US English", "Medical Terms")',
                default: (props) => friendlyName(props.name),
            },
            {
                type: 'input',
                name: 'description',
                message: 'Description',
                default: (props) => title(props.friendlyName) + ' dictionary for cspell.',
            },
            {
                type: 'input',
                name: 'srcFile',
                message: 'Source File Name',
                default: (props) => props.name + '.txt',
            },
            {
                type: 'input',
                name: 'locale',
                message:
                    'Language locale, example: "en,en-US" for English and English US, "fr" for French, or use "*" for programming language dictionaries.',
                default: '*',
            },
            {
                type: 'input',
                name: 'languageId',
                message: 'Programming languageID/filetype, i.e. "typescript", "php", "go", or "*" for any.',
                default: '*',
            },
            {
                type: 'confirm',
                name: 'useTrie',
                message: 'Store as Trie: Mainly used for natural language dictionaries to store their large sizes.',
                default: (props) => ['.dic', '.aff'].includes(extname(props.srcFile)),
            },
            {
                type: 'confirm',
                name: 'doBuild',
                message: 'Compile Dictionary?',
                default: (props) => this.fs.exists(props.srcFile) && ['.dic', '.aff'].includes(extname(props.srcFile)),
            },
        ]);

        const dir = join(dictionaryDir, props.name);
        if (this.noPrompts && existsSync(this.destinationPath(dir))) {
            throw new Error(`${dir} already exists. Remove it or choose another name.`);
        }

        props.fileExt = props.useTrie ? 'trie' : 'txt';
        props.command = props.useTrie ? 'compile-trie' : 'compile';
        props.format = props.useTrie ? 'trie3' : 'plaintext';
        props.generateNonStrict = props.useTrie ? 'true' : 'false';

        props.packageName = props.name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
        props.dstFileName = 'dict/' + props.packageName + '.' + props.fileExt;
        props.compressDest = false; // depProps.useTrie;
        props.dstFullFileName = props.dstFileName + (props.compressDest ? '.gz' : '');

        props.filesToCopy = [];
        const srcFile = resolve(props.srcFile);
        this.log(srcFile);

        const ext = extname(srcFile);
        const srcFiles = [];
        if (ext === '.dic' || ext === '.aff') {
            const srcAff = join(dirname(srcFile), basename(srcFile, ext) + '.aff');
            const srcDic = join(dirname(srcFile), basename(srcFile, ext) + '.dic');
            this.fs.exists(srcAff) && srcFiles.push(srcAff);
            this.fs.exists(srcDic) && srcFiles.push(srcDic);
            props.srcFileReader = 'hunspell-reader words -n 1000 -m 0';
            props.prepareScript = 'echo OK';
            props.prepublishOnlyScript = 'echo OK';
        } else {
            this.fs.exists(srcFile) && srcFiles.push(srcFile);
            props.srcFileReader = 'head -n 1000';
            props.prepareScript = 'pnpm run build';
            props.prepublishOnlyScript = 'echo OK';
        }
        srcFiles.forEach((srcFile) => props.filesToCopy.push([srcFile, join('src', basename(srcFile))]));

        props.srcFile = 'src/' + basename(srcFile);
        props.fullPackageName = '@cspell/dict-' + props.packageName;
        props.year = new Date().getFullYear();

        this.props = Object.assign({}, props, props);
    }

    /**
     * Prompt for the answers not given on the command line, in order. With `--yes`, use the defaults instead.
     */
    async _ask(questions) {
        const given = this.options.answers ?? {};
        const yes = !!this.options.yes || questions.every((q) => given[q.name] !== undefined);
        this.noPrompts = yes;
        const missing = questions.filter((q) => given[q.name] === undefined).map((q) => optionForAnswer[q.name]);
        if (!yes && !process.stdin.isTTY) {
            throw new Error(`No terminal to prompt in. Give --yes, or all of: ${missing.join(', ')}.`);
        }
        if (!yes) {
            this.log(yosay('Welcome to the ' + chalk.red('cspell-dicts') + ' generator!'));
        }

        const answers = {};
        for (const q of questions) {
            const value = given[q.name] ?? (yes ? defaultValue(q, answers) : undefined);
            if (value === undefined && !yes) {
                const def = typeof q.default === 'function' ? () => q.default(answers) : q.default;
                Object.assign(answers, await this.prompt([{ ...q, default: def }]));
                continue;
            }
            const valid = q.validate ? q.validate(value) : true;
            if (valid !== true) {
                throw new Error(`${optionForAnswer[q.name]}: ${valid}`);
            }
            answers[q.name] = value;
        }
        return answers;
    }

    async writing() {
        const files = [
            'package.json',
            'README.md',
            'cspell-ext.json',
            'cspell.json',
            'LICENSE',
            'cspell-tools.config.yaml',
            'dict/README.md',
            'src/README.md',
        ];
        files.forEach((fromTo) => {
            fromTo = typeof fromTo === 'string' ? [fromTo, fromTo] : fromTo;
            const [src, dst] = fromTo;
            this.fs.copyTpl(this.templatePath(src), this.destinationPath(dst), this.props);
        });
        this.props.filesToCopy
            .map((toCopy) => (typeof toCopy === 'string' ? [toCopy, basename(toCopy)] : toCopy))
            .map((toCopy) => [toCopy[0], this.destinationPath(toCopy[1])])
            .forEach(([fromFile, toFile]) => this.fs.copy(fromFile, toFile));
        const srcFile = this.destinationPath(this.props.srcFile);
        if (!this.fs.exists(srcFile)) {
            this.log(chalk.yellow('Source file not found: %s\nCreating an empty file.'), chalk.red(srcFile));
            this.fs.write(srcFile, `# ${title(this.props.friendlyName)} Terms\n`);
        }
        // await mkdirp(path.join(this.destinationPath, path.dirname(this.props.dstFullFileName)));
        this.fs.write(this.destinationPath(this.props.dstFileName), '# dest');
    }

    async default() {
        if (basename(this.destinationPath()) !== this.props.name) {
            this.log('Creating Folder: ' + this.props.name);
            const dir = join(dictionaryDir, this.props.name);
            await mkdirp(this.destinationPath(dir));
            await mkdirp(this.destinationPath(join(dir, 'dict')));
            this.destinationRoot(this.destinationPath(dir));
        }
    }

    install() {
        this.spawnSync('pnpm', ['install']);
    }

    end() {
        if (this.props.doBuild) {
            this.spawnSync('pnpm', ['run', 'build']);
            this.spawnSync('pnpm', ['run', 'prepare:dictionary']);
        }
    }
}

function defaultValue(question, answers) {
    return typeof question.default === 'function' ? question.default(answers) : question.default;
}

function validateName(name) {
    if (!name) return 'missing. Give the package directory name, such as en_AU or ruby.';
    return /^[\w-]+$/.test(name) || `"${name}" can only have letters, digits, "_", and "-".`;
}

function friendlyName(name) {
    const words = name.split('-').map(title);
    return words.join(' ');
}

function title(s) {
    return s[0].toUpperCase() + s.slice(1);
}
