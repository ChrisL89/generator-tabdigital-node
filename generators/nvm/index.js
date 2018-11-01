'use strict';

const Generator     = require('yeoman-generator');
const chalk         = require('chalk');
const semver        = require('semver');
const _             = require('lodash');

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);

    this.option('nodeVersion', {
      type: String,
      require: true,
      desc: 'Node version you specify'
    });
  }

  _readPackageJSON() {
    return this.fs.readJSON(
      this.destinationPath('package.json'),
      {}
    );
  }

  _askForVersion() {
    return this.prompt({
      name: 'nodeVersion',
      message: 'Node version, eg. 10.6.0, 8.6, or 8',
      default: '8.6.0',
      validate: answer => semver.valid(semver.coerce(answer)) !== null,
    });
  }

  _getNodeVersion() {
    const nodeVersion = this.options.nodeVersion;

    if (nodeVersion) {
      return Promise.resolve({ nodeVersion });
    }

    return this._askForVersion();
  }

  prompting() {
    this.nvmProps = {};
    return this._getNodeVersion()
      .then(answer => {
        _.merge(
          this.nvmProps,
          answer
        );
      });
  }

  writing() {
    const pkg = this._readPackageJSON();
    const version = semver.valid(semver.coerce(this.nvmProps.nodeVersion));

    _.merge(pkg, {
      engines: {
        npm: '>= ' + version
      },
    });

    this.fs.writeJSON(
      this.destinationPath('package.json'),
      pkg
    );

    this.fs.write(this.destinationPath('.nvmrc'), version);
  }

  end() {
    this.log(chalk.yellow('nvm configuration initialised! 🔰'));
  }
};
