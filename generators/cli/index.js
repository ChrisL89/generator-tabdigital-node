'use strict';

const Generator             = require('yeoman-generator');
const chalk                 = require('chalk');
const validatePackageName   = require('validate-npm-package-name');
const _                     = require('lodash');
const path                  = require('path');

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);

    this.option('name', {
      type: String,
      required: true,
      desc: 'Project name'
    });
  }

  _readPackageJSON() {
    return this.fs.readJSON(
      this.destinationPath('package.json'),
      {}
    );
  }

  _askForName() {
    return this.prompt({
      name: 'name',
      message: 'Package Name',
      default: path.basename(process.cwd()),
      validate: answer => {
        const validity = validatePackageName(answer);

        return (validity.validForNewPackages) ? true : validity.errors[0];
      }
    });
  }

  _getPackageName() {
    const pkg = this._readPackageJSON();

    const currentName = this.options.name || pkg.name;

    if (currentName) {
      return Promise.resolve({ name: currentName });
    }

    return this._askForName();
  }

  prompting() {
    this.packageProps = {};

    return this._getPackageName()
      .then(answer => {
        _.merge(
          this.packageProps,
          answer
        );
      });
  }

  writing() {
    const pkg = this._readPackageJSON();

    if (!pkg.name && this.packageProps.name) {
      pkg.name = this.packageProps.name;
    }

    _.merge(pkg, {
      bin: 'src/cli.js',
      dependencies: {
        meow: '^5.0.0'
      },
      devDependencies: {
        lec: '^1.0.1'
      },
      scripts: {
        prepare: 'lec src/cli.js -c LF'
      }
    });

    this.fs.writeJSON(
      this.destinationPath('package.json'),
      pkg
    );

    this.fs.copyTpl(
      this.templatePath('cli.js'),
      this.destinationPath('src/cli.js'),
      {
        packageName: pkg.name,
        packageSafeName: _.camelCase(pkg.name),
      }
    );
  }

  end() {
    this.log(chalk.yellow('CLI entry point and dependencies have been initialised 🖥'));
  }
};
