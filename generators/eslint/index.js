'use strict';

const Generator     = require('yeoman-generator');
const chalk         = require('chalk');
const _             = require('lodash');

module.exports = class extends Generator {
  _readPackageJSON() {
    return this.fs.readJSON(
      this.destinationPath('package.json'),
      {}
    );
  }

  initializing() {
    this.fs.copy(
      this.templatePath('eslintrc.json'),
      this.destinationPath('.eslintrc.json')
    );
  }

  writing() {
    const pkg = this._readPackageJSON();

    _.merge(pkg, {
      scripts: {
        'lint': 'eslint --ignore-path .gitignore --ext .js .',
      },
      devDependencies: {
        'eslint': '^5.1.0',
      },
    });

    this.fs.writeJSON(
      this.destinationPath('package.json'),
      pkg
    );
  }

  end() {
    this.log(chalk.yellow('Eslint configuration initialised! 📝'));
  }
};