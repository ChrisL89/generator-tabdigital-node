'use strict';

const Generator   = require('yeoman-generator');
const chalk       = require('chalk');
const _           = require('lodash');

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);

    this.option('api', {
      type: Boolean,
      required: false,
      desc: 'Install api server'
    });
  }

  _readPackageJSON() {
    return this.fs.readJSON(
      this.destinationPath('package.json'),
      {}
    );
  }

  _askSourceProps() {
    return this.prompt({
      name: 'api',
      message: 'Is this an api server?',
      type: 'confirm',
      default: false,
      store: true,
    });
  }

  _getSourceProps() {
    const api = this.options.api;

    if (api) {
      return Promise.resolve({ api });
    }

    return this._askSourceProps();
  }

  prompting() {
    this.sourceProps = {};
    return this._getSourceProps()
      .then(answer => {
        _.merge(
          this.sourceProps,
          answer
        );
      });
  }

  configuring() {
    const pkg = this._readPackageJSON();

    _.merge(pkg, {
      dependencies: {
        '@tabdigital/api-logger': '^3.1.0',
        'async': '^2.6.1',
        'dotenv': '^6.0.0',
        'lodash': '^4.17.10'
      },
    });

    this.fs.writeJSON(
      this.destinationPath('package.json'),
      pkg
    );
  }

  writing() {
    const srcTemplates = [
      '/index.js',
      '/start.js',
      '/env.js',
      '/log.js',
    ];

    const apiEnabled = this.sourceProps.api;

    for (const tpl of srcTemplates) {
      const destPath = this.destinationPath(`${this.options.projectRoot}${tpl}`);
      this.fs.copyTpl(this.templatePath(`src${tpl}`), destPath, { apiEnabled });
    }

    this.options.api = apiEnabled;

    this.composeWith(require.resolve('./api'), this.options);
  }

  end() {
    this.log(chalk.green('Package created. Happy hacking! 🎉'));
  }
};
