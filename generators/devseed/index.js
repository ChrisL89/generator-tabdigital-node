'use strict';

const Generator   = require('yeoman-generator');
const chalk       = require('chalk');
const _           = require('lodash');

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);

    this.SEED_DEP = {
      '@tabdigital/dev-seed': '^1.0.3',
    };

    this.SEED_SCRIPTS = {
      'build-dev-seed': 'dev-seed build',
      'start-dev-seed': 'dev-seed start',
      'restart-dev-seed': 'dev-seed restart',
      'stop-dev-seed': 'dev-seed stop',
      'tail-dev-seed': 'dev-seed tail',
      'clean-dev-seed': 'dev-seed clean',
    };
  }

  _readPackageJSON() {
    return this.fs.readJSON(
      this.destinationPath('package.json'),
      {}
    );
  }

  initialising() {
    this.fs.copy(
      this.templatePath('config.yaml'),
      this.destinationPath('dev-seed/config.yaml')
    );
  }

  writing() {
    const pkg = this._readPackageJSON();

    pkg.devDependencies = pkg.devDependencies || {};
    pkg.scripts = pkg.scripts || {};

    _.merge(pkg.devDependencies, this.SEED_DEP); //init npm
    _.merge(pkg.scripts, this.SEED_SCRIPTS);

    this.fs.writeJSON(
      this.destinationPath('package.json'),
      pkg
    );
  }

  end() {
    this.log(chalk.green('Successfully initialised dev-seed dependencies! 🌱'));
  }
};
