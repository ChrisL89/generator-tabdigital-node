'use strict';

const Generator   = require('yeoman-generator');
const chalk       = require('chalk');
const _           = require('lodash');

module.exports = class extends Generator {
  _readPackageJSON() {
    return this.fs.readJSON(
      this.destinationPath('package.json'),
      {}
    );
  }

  configuring() {
    const pkg = this._readPackageJSON();

    _.merge(pkg, {
      dependencies: {
        '@tabdigital/api-error': '0.0.2',
        '@tabdigital/api-middleware': '^3.0.0',
        '@tabdigital/connect-router': '^5.0.0',
        'restify': '^7.2.1',
        'restify-errors': '^6.1.1',
      },
    });

    this.fs.writeJSON(
      this.destinationPath('package.json'),
      pkg
    );

    this.apiProps = {
      packageName: pkg.name,
      apiEnabled: this.options.api
    };
  }

  writing() {
    const apiServiceTemplates = [
      '/bootstraps/api-service',
      '/utils',
      '/components/status',
      '/components/index.js',
      '/components/router.js',
      '/components/swagger.js'
    ];

    // If the user is generating a webservice, we include the sample hello-world service.
    // Otherwise, we only include the status routes, as they are still required by the 
    // load balancer regardless of what type of service is being implemented.
    if (this.options.api) {
      apiServiceTemplates.push('/components/hello-world');
    }

    for (const tpl of apiServiceTemplates) {
      const destPath = this.destinationPath(`${this.options.projectRoot}${tpl}`);
      this.fs.copyTpl(this.templatePath(`src${tpl}`), destPath, this.apiProps);
    }
  }

  end() {
    this.log(chalk.green('Api service installed. 🏗'));
  }
};
