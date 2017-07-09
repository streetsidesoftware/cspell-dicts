'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('source', {
      desc: 'Source file for the dictionary. It will be copied to into the local dictionary folder.',
      type: String,
      required: false,
      alias: 's'
    });

    this.argument('name', {
      desc: 'Name of Dictionary',
      type: String,
      required: true
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
      }
    ];

    return this.prompt(namePrompts).then(props => {
      return this.prompt([
        {
          type: 'input',
          name: 'description',
          message: 'Description',
          default: title(props.name) + ' dictionary for cspell.'
        },
        {
          type: 'input',
          name: 'srcFile',
          message: 'Source File Name',
          default: this.options.source || props.name + '.txt'
        },
        {
          type: 'confirm',
          name: 'useTrie',
          message: 'Store as Trie',
          default: true
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

        this.props = Object.assign({}, props, depProps);
      });
    });
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
      this.props
    );
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
      mkdirp(this.props.name);
      this.destinationRoot(this.destinationPath(this.props.name));
    }
  }

  install() {
    this.installDependencies({
      npm: true,
      bower: false,
      yarn: false
    });
  }
};

function title(s) {
  return s[0].toUpperCase() + s.slice(1);
}

