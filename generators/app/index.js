'use strict';

const Generator                   = require('yeoman-generator');
const chalk                       = require('chalk');
const validatePackageName         = require('validate-npm-package-name');
const path                        = require('path');
const _                           = require('lodash');

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);

    this.option('name', {
      type: String,
      required: true,
      desc: 'Project name'
    });

    this.option('repositoryName', {
      type: String,
      required: false,
      default: this.options.name,
      desc: 'Name of the GitHub repository'
    });

    this.option('githubOrg', {
      type: String,
      required: false,
      default: 'TabDigital',
      desc: 'GitHub Organisation or Username'
    });

    this.option('devseed', {
      type: Boolean,
      required: false,
      default: false,
      desc: 'Include dev-seed configuration'
    });

    this.option('nodeVersion', {
      type: String,
      require: true,
      desc: 'Node version you specify'
    });

    this.option('cli', {
      type: Boolean,
      required: false,
      default: false,
      desc: 'Add a CLI entry point'
    });

    this.option('eslint', {
      type: Boolean,
      required: false,
      default: false,
      desc: 'Lint your code in same coding style'
    });

    this.option('projectRoot', {
      type: String,
      required: false,
      default: 'src',
      desc: 'Relative path to the project code root'
    });

    this.option('api', {
      type: Boolean,
      required: false,
      desc: 'This project contains api service'
    });
  }

  _readPackageJSON() {
    return this.fs.readJSON(
      this.destinationPath('package.json'),
      {}
    );
  }

  _askForName() {
    let askedName;

    if (this.packageProps.name) {
      askedName = Promise.resolve({ name: this.packageProps.name });
    } else {
      askedName = this.prompt(
        {
          name: 'name',
          message: 'Package Name',
          default: path.basename(process.cwd()),
          validate: answer => {
            const validity = validatePackageName(answer);

            return (validity.validForNewPackages)? true : validity.errors[0];
          }
        }
      );
    }

    return askedName.then(answer => {
      Object.assign(this.packageProps, this._getNameParts(answer.name));
    });
  }

  _getNameParts(name) {
    const moduleName = { name, repositoryName: this.packageProps.repositoryName };

    moduleName.localName = moduleName.name;
    if (moduleName.name.startsWith('@')) {
      const nameParts = moduleName.name.slice(1).split('/');

      Object.assign(moduleName, {
        scopeName: nameParts[0],
        localName: nameParts[1]
      });
    }

    if (!moduleName.repositoryName) {
      moduleName.repositoryName = moduleName.localName;
    }

    return moduleName;
  }

  _askFor() {
    const prompts = [
      {
        name: 'description',
        message: 'Description',
        when: !this.packageProps.description
      },
      {
        name: 'authorName',
        message: 'Authors Name',
        when: !this.packageProps.authorName,
        default: this.user.git.name(),
        store: true
      },
      {
        name: 'authorEmail',
        message: 'Authors Email',
        when: !this.packageProps.authorEmail,
        default: this.user.git.email(),
        store: true
      },
      {
        name: 'keywords',
        message: 'Package keywords (comma to split)',
        when: !this.pkg.keywords,
        filter(words) {
          return words.split(/\s*,\s*/g);
        }
      },
      {
        name: 'nvm',
        type: 'confirm',
        when: !this.options.nodeVersion,
        default: true,
        message: 'Use nvm to specific node version?',
      },
      {
        name: 'devseed',
        type: 'confirm',
        when: !this.options.devseed,
        message: 'Include dev-seed configuration?',
      },
      {
        name: 'cli',
        type: 'confirm',
        when: !this.options.cli,
        default: false,
        message: 'Include CLI dependencies and entry point?',
      },
      {
        name: 'eslint',
        type: 'confirm',
        when: !this.options.eslint,
        default: true,
        message: 'Include default Eslint configuration?',
      }
    ];

    return this.prompt(prompts).then(props => _.merge(this.packageProps, props));
  }

  initializing() {
    //if an existing package.json is present, let's utilise what's there!
    this.pkg = this._readPackageJSON();

    this.packageProps = {
      name: this.options.name,
    };

    if (this.options.name) {
      const validity = validatePackageName(this.options.name);
      if (!validity.validForNewPackages) {
        throw new Error(validity.errors[0] || 'The name provided is not a valid npm package name');
      }
    }
  }

  prompting() {
    return this._askForName()
      .then(this._askFor.bind(this));
  }

  _createPkg() {
    const currentPackage = this._readPackageJSON();

    const pkg = _.merge({
      name: this.packageProps.name,
      version: '0.0.0',
      description: this.packageProps.description,
      author: {
        name: this.packageProps.authorName,
        email: this.packageProps.authorEmail,
      },
      files: [this.options.projectRoot],
      main: path.join(this.options.projectRoot, 'index.js').replace(/\\/g, '/'),
      keywords: [],
      devDependencies: {
        'nodemon': '^1.18.4',
      },
      engines: {
        npm: '>= 8.0.0'
      },
      scripts: {
        start: 'node src/index.js',
        'start:dev': 'nodemon src/index.js'
      }
    }, currentPackage);

    if (this.packageProps.keywords && this.packageProps.keywords.length) {
      pkg.keywords = _.uniq(this.packageProps.keywords);
    }

    this.fs.writeJSON(
      this.destinationPath('package.json'),
      pkg
    );
  }

  configuring() {
    this._createPkg();
  }

  default() {
    this.composeWith(require.resolve('../git'), {
      name: this.packageProps.name,
      githubOrg: this.options.githubOrg,
      repositoryName: this.packageProps.repositoryName
    });

    if (this.packageProps.cli) {
      this.composeWith(require.resolve('../cli'), {
        name: this.packageProps.name,
      });
    }

    const additionalComposers = ['nvm', 'devseed', 'eslint'];
    _.each(additionalComposers, composer => {
      if (_.get(this.packageProps, composer)) {
        this.composeWith(require.resolve(`../${composer}`), {});
      }
    });
  }

  writing() {
    this.composeWith(require.resolve('./source'), {
      api: this.options.api,
      projectRoot: this.options.projectRoot,
    });
  }

  installing() {
    this.npmInstall();
  }

  end() {
    this.log(chalk.green('Package created. Happy hacking! 🎉'));
  }
};
