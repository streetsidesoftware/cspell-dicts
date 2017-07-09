'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('generator-cspell-dicts') + ' generator!'
    ));

    const prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        default: this.appname // Default to current folder name
      },
      {
        type: 'input',
        name: 'description',
        message: 'Description',
        default: this.appname[0].toUpperCase() + this.appname.slice(1) + ' dictionary for cspell.'
      },
      {
        type: 'input',
        name: 'srcFile',
        message: 'Source File Name',
        default: this.appname + '.txt'
      },
      {
        type: 'confirm',
        name: 'useTrie',
        message: 'Store as Trie',
        default: true
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;

      props.fileExt = props.useTrie ? 'trie.gz' : 'txt.gz';
      props.command = props.useTrie ? 'compile-trie' : 'compile';
      props.dstFileName = path.basename(props.srcFile, props.srcFile.replace(/^.*(\.\w+)$/, '$1')) +
        '.' + props.fileExt;
      this.props = props;
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
  }

  install() {
    this.installDependencies({
      npm: true,
      bower: false,
      yarn: false
    });
  }
};
