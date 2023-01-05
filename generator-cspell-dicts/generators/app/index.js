'use strict';

// cspell:ignore yosay

const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');
const mkdirp = require('mkdirp');

const dictionaryDir = 'dictionaries';

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        this.argument('name', {
            desc: 'Name of Dictionary',
            type: String,
            required: true,
        });

        this.argument('source', {
            desc: 'Source file for the dictionary. It will be copied to into the local dictionary folder.',
            type: String,
            required: false,
            default: '',
        });
    }

    async prompting() {
        // Have Yeoman greet the user.
        this.log(yosay('Welcome to the ' + chalk.red('cspell-dicts') + ' generator!'));

        const namePrompts = [
            {
                type: 'input',
                name: 'name',
                message: 'The package name',
                default: this.options.name || this.appname, // Default to current folder name
            },
            {
                type: 'input',
                name: 'friendlyName',
                message: 'Friendly Name',
                default: this.options.name || this.appname, // Default to current folder name
            },
        ];

        const props = await this.prompt(namePrompts);
        const depProps = await this.prompt([
            {
                type: 'input',
                name: 'description',
                message: 'Description',
                default: title(props.friendlyName) + ' dictionary for cspell.',
            },
            {
                type: 'input',
                name: 'srcFile',
                message: 'Source File Name',
                default: this.options.source || props.name + '.txt',
            },
            {
                type: 'input',
                name: 'local',
                message:
                    'Language locale, example: "en,en-US" for English and English US, "fr" for French, or use "*" for programming language dictionaries.',
                default: '*',
            },
            {
                type: 'input',
                name: 'languageId',
                message: 'Programing languageID/filetype, i.e. "typescript", "php", "go", or "*" for any.',
                default: '*',
            },
            {
                type: 'confirm',
                name: 'useTrie',
                message: 'Store as Trie',
                default: ['.dic', '.aff'].includes(path.extname(this.options.source)),
            },
            {
                type: 'confirm',
                name: 'doBuild',
                message: 'Compile Dictionary?',
                default:
                    this.fs.exists(this.options.source) && ['.dic', '.aff'].includes(path.extname(this.options.source)),
            },
        ]);

        depProps.fileExt = depProps.useTrie ? 'trie' : 'txt';
        depProps.command = depProps.useTrie ? 'compile-trie' : 'compile';
        depProps.format = depProps.useTrie ? 'trie3' : 'plaintext';
        depProps.generateNonStrict = depProps.useTrie ? 'true' : 'false';

        props.packageName = props.name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
        depProps.dstFileName = 'dict/' + props.packageName + '.' + depProps.fileExt;
        depProps.compressDest = false; // depProps.useTrie;
        depProps.dstFullFileName = depProps.dstFileName + (depProps.compressDest ? '.gz' : '');

        props.filesToCopy = [];
        const srcFile = path.resolve(depProps.srcFile);
        this.log(srcFile);

        const ext = path.extname(srcFile);
        const srcFiles = [];
        if (ext === '.dic' || ext === '.aff') {
            const srcAff = path.join(path.dirname(srcFile), path.basename(srcFile, ext) + '.aff');
            const srcDic = path.join(path.dirname(srcFile), path.basename(srcFile, ext) + '.dic');
            this.fs.exists(srcAff) && srcFiles.push(srcAff);
            this.fs.exists(srcDic) && srcFiles.push(srcDic);
            props.srcFileReader = 'hunspell-reader words -n 1000 -m 0';
            props.prepareScript = 'echo OK';
            props.prepublishOnlyScript = 'echo OK';
        } else {
            this.fs.exists(srcFile) && srcFiles.push(srcFile);
            props.srcFileReader = 'head -n 1000';
            props.prepareScript = 'yarn run build';
            props.prepublishOnlyScript = 'echo OK';
        }
        srcFiles.forEach((srcFile) => props.filesToCopy.push([srcFile, path.join('src', path.basename(srcFile))]));

        depProps.srcFile = 'src/' + path.basename(srcFile);
        props.fullPackageName = '@cspell/dict-' + props.packageName;

        this.props = Object.assign({}, props, depProps);
    }

    async writing() {
        const files = [
            'package.json',
            'README.md',
            'CHANGELOG.md',
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
            .map((toCopy) => (typeof toCopy === 'string' ? [toCopy, path.basename(toCopy)] : toCopy))
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
        if (path.basename(this.destinationPath()) !== this.props.name) {
            this.log('Creating Folder: ' + this.props.name);
            const dir = path.join(dictionaryDir, this.props.name);
            await mkdirp(this.destinationPath(dir));
            await mkdirp(this.destinationPath(path.join(dir, 'dict')));
            this.destinationRoot(this.destinationPath(dir));
        }
    }

    install() {
        this.spawnCommandSync('yarn');
    }

    end() {
        if (this.props.doBuild) {
            this.spawnCommandSync('yarn', ['run', 'build']);
            this.spawnCommandSync('yarn', ['run', 'prepare']);
        }
    }
};

function title(s) {
    return s[0].toUpperCase() + s.slice(1);
}
