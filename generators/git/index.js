'use strict';

const Generator   = require('yeoman-generator');
const chalk       = require('chalk');
const _           = require('lodash');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('githubOrg', {
      type: String,
      required: true,
      desc: 'Github Organisation or Username',
      default: 'TabDigital'
    });

    this.option('repositoryName', {
      type: String,
      required: true,
      desc: 'Name of the Github Repository'
    });

    this.option('gitLocation', {
      type: String,
      required: true,
      desc: 'Git Location',
      default: 'github.tabcorp.com.au'
    });
  }

  _readPackageJSON() {
    return this.fs.readJSON(
      this.destinationPath('package.json'),
      {}
    );
  }

  _askFor() {
    const prompts = [
      {
        name: 'githubOrg',
        type: String,
        message: 'Target GitHub organisation',
        required: true,
        default: this.options.githubOrg,
        when: !this.packageProps.githubOrg,
      },
      {
        name: 'repositoryName',
        type: String,
        message: 'Target Git repository name',
        required: true,
        default: this.options.repositoryName,
        when: !this.packageProps.repositoryName,
        validate: answer => answer !== '',
      },
      {
        name: 'gitLocation',
        type: String,
        message: 'Target Git location',
        required: true,
        default: this.options.gitLocation,
        when: !this.packageProps.gitLocation
      }
    ];

    return this.prompt(prompts).then(props => _.merge(this.packageProps, props));
  }

  initializing() {
    this.packageProps = {
      githubOrg: this.options.githubOrg,
      repositoryName: this.options.repositoryName,
      gitLocation: this.options.gitLocation,
    };

    this.fs.copy(
      this.templatePath('gitignore'),
      this.destinationPath('.gitignore')
    );
  }

  prompting() {
    return this._askFor();
  }

  writing() {
    const pkg = this._readPackageJSON();

    let repository = `${this.packageProps.githubOrg}/${this.packageProps.repositoryName}`;

    if (!repository) {
      throw new Error('Unable to initialise git repository. Provided values: ' + repository);
    }

    if (repository.indexOf('.git') === -1) { //ensure the remote is built correctly
      repository = `git@${this.packageProps.gitLocation}:${repository}.git`;
    }

    pkg.repository = {
      type: 'git',
      url: repository,
    };

    this.packageProps.repository = pkg.repository;

    this.fs.writeJSON(
      this.destinationPath('package.json'),
      pkg
    );
  }

  end() {
    this.spawnCommandSync('git', ['init', '-q'], { cwd: this.destinationPath() });

    this.log(chalk.green('Successfully initialised git 🐙'));

    const repository = this.packageProps.repository;

    if (repository !== undefined && repository.url) {
      this.spawnCommandSync('git', ['remote', 'add', 'origin', repository.url], {
        cwd: this.destinationPath()
      });

      this.log(`Created remote origin @ ${repository.url}`);
    }
  }
};