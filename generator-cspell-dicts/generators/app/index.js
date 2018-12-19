'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');
const mkdirp = require('mkdirp');

const packagesDir = 'packages';

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument('name', {
      desc: 'Name of Dictionary',
      type: String,
      required: true
    });

    this.argument('source', {
      desc: 'Source file for the dictionary. It will be copied to into the local dictionary folder.',
      type: String,
      required: false,
      default: ''
    });
  }

  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('cspell-dicts') + ' generator!'
    ));

    const namePrompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        default: this.options.name || this.appname // Default to current folder name
      },
      {
        type: 'input',
        name: 'friendlyName',
        message: 'Friendly Name',
        default: this.options.name || this.appname // Default to current folder name
      }
    ];

    return this.prompt(namePrompts).then(props => {
      return this.prompt([
        {
          type: 'input',
          name: 'description',
          message: 'Description',
          default: title(props.friendlyName) + ' dictionary for cspell.'
        },
        {
          type: 'input',
          name: 'srcFile',
          message: 'Source File Name',
          default: this.options.source || props.name + '.txt'
        },
        {
          type: 'input',
          name: 'local',
          message: 'Language local, example: "en,en-US" for English and English US, "fr" for French, or "*" for all locals (programming language dictionaries)',
          default: '*'
        },
        {
          type: 'input',
          name: 'languageId',
          message: 'Programing languageID, i.e. "typescript", "php", "go", or "*" for any.',
          default: '*'
        },
        {
          type: 'confirm',
          name: 'useTrie',
          message: 'Store as Trie',
          default: ['.dic', '.aff'].includes(path.extname(this.options.source))
        },
        {
          type: 'confirm',
          name: 'doBuild',
          message: 'Compile Dictionary?',
          default: this.fs.exists(this.options.source)
        }
      ]).then(depProps => {
        depProps.fileExt = depProps.useTrie ? 'trie.gz' : 'txt.gz';
        depProps.command = depProps.useTrie ? 'compile-trie' : 'compile';

        depProps.dstFileName = path.basename(depProps.srcFile, path.extname(depProps.srcFile)) +
          '.' + depProps.fileExt;

        props.filesToCopy = [];
        const srcFile = path.resolve(depProps.srcFile);
        this.log(srcFile);

        if (this.fs.exists(srcFile)) {
          props.filesToCopy.push(srcFile);
          if (path.extname(srcFile) === '.dic') {
            props.filesToCopy.push(path.join(
              path.dirname(srcFile),
              path.basename(srcFile, '.dic') + '.aff'
            ));
          }
        }

        depProps.srcFile = path.basename(srcFile);
        props.packageName = props.name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
        props.fullPackageName = 'cspell-dict-' + props.packageName;

        this.props = Object.assign({}, props, depProps);
      });
    });
  }

  writing() {
    const files = [
      'package.json',
      'README.md',
      'CHANGELOG.md',
      'cspell-ext.json',
      'LICENSE'
    ];
    files.forEach(fromTo => {
      fromTo = typeof fromTo === 'string' ? [fromTo, fromTo] : fromTo;
      const [src, dst] = fromTo;
      this.fs.copyTpl(
        this.templatePath(src),
        this.destinationPath(dst),
        this.props
      );
    });
    this.props.filesToCopy.forEach(name => {
      this.fs.copy(
        name,
        this.destinationPath(path.basename(name))
      );
    });
  }

  default() {
    if (path.basename(this.destinationPath()) !== this.props.name) {
      this.log(
        'Creating Folder: ' + this.props.name
      );
      const dir = path.join(packagesDir, this.props.name);
      mkdirp(this.destinationPath(dir));
      this.destinationRoot(this.destinationPath(dir));
    }
  }

  install() {
    this.npmInstall();
  }

  end() {
    if (this.props.doBuild) {
      this.spawnCommand('npm', ['run', 'build']);
    }
    // Fetch .js files from utils.
    this.spawnCommand('npm', ['run', 'prepublishOnly']);
  }
};

function title(s) {
  return s[0].toUpperCase() + s.slice(1);
}

