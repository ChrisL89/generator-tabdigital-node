'use strict';
const helpers       = require('yeoman-test');
const assert        = require('yeoman-assert');
const _             = require('lodash');

function bootstrapRunner() {
  return helpers.run(require.resolve('../generators/app'));
}

describe('tabdigital-node:app', () => {

  describe('generating a new project', () => {

    it('generates a new full project', () => {
      const answers = {
        name: 'some-test',
        description: 'a test project',
        authorName: 'fred flinstone',
        authorEmail: 'fred.flinstone@bedrock.org',
        keywords: ['foo', 'bar'],
        nvm: true,
        devseed: true,
        cli: true,
        eslint: true,
      };

      return bootstrapRunner()
        .withOptions({ api: true })
        .withPrompts(answers)
        .then(() => {
          assert.file([
            '.nvmrc',
            '.eslintrc.json',
            '.gitignore',
            'package.json',
            'dev-seed/config.yaml',
            'src/index.js',
            'src/start.js',
            'src/env.js',
            'src/log.js',
            'src/cli.js',
            'src/components',
            'src/utils',
          ]);

          assert.jsonFileContent(
            'package.json',
            {
              'name': 'some-test',
              'version': '0.0.0',
              'description': 'a test project',
              'author': {
                'name': 'fred flinstone',
                'email': 'fred.flinstone@bedrock.org'
              },
              'files': [
                'src'
              ],
              'main': 'src/index.js',
              'keywords': [
                'foo',
                'bar',
              ],
              'devDependencies': {
                'nodemon': '^1.18.4',
                '@tabdigital/dev-seed': '^1.0.3',
                'eslint': '^5.1.0',
                'lec': '^1.0.1',
              },
              'engines': {
                'npm': '>= 8.6.0'
              },
              'repository': {
                'type': 'git',
                'url': 'git@github.tabcorp.com.au:TabDigital/some-test.git'
              },
              'scripts': {
                'start': 'node src/index.js',
                'start:dev': 'nodemon src/index.js',
                'build-dev-seed': 'dev-seed build',
                'start-dev-seed': 'dev-seed start',
                'restart-dev-seed': 'dev-seed restart',
                'stop-dev-seed': 'dev-seed stop',
                'tail-dev-seed': 'dev-seed tail',
                'clean-dev-seed': 'dev-seed clean',
                'lint': 'eslint --ignore-path .gitignore --ext .js .',
                'prepare': 'lec src/cli.js -c LF'
              },
              'bin': 'src/cli.js',
              'dependencies': {
                '@tabdigital/api-logger': '^3.1.0',
                '@tabdigital/api-middleware': '^3.0.0',
                '@tabdigital/connect-router': '^5.0.0',
                'async': '^2.6.1',
                'lodash': '^4.17.10',
                'meow': '^5.0.0',
                'restify': '^7.2.1',
                'restify-errors': '^6.1.1',
              }
            }
          );

        });
    });

    it('updates an existing project', () => {
      const existingPkg = {
        version: '1.0.0',
        description: 'some description of an existing project',
        author: 'barney rubble',
        keywords: ['foo']
      };

      const answers = {
        name: 'new-project-name'
      };

      return bootstrapRunner()
        .withPrompts(answers)
        .on('ready', generator => {
          generator.fs.writeJSON(generator.destinationPath('package.json'), existingPkg);
        })
        .then(() => {
          const newPkg = _.merge({ name: 'new-project-name' }, existingPkg);

          assert.JSONFileContent('package.json', newPkg);
        });
    });
  });

  describe('--name', () => {
    it('allows scopes for package names', () => {
      const answers = {
        name: '@some-scope/some-package',
      };

      return bootstrapRunner()
        .withPrompts(answers)
        .then(() => {
          assert.JSONFileContent(
            'package.json',
            {
              name: '@some-scope/some-package'
            }
          );

          assert.fileContent([
            ['.git/config', '[remote "origin"]'],
            ['.git/config', 'url = git@github.tabcorp.com.au:TabDigital/some-package.git'],
          ]);
        });
    });

    it('throws an error when an invalid name is provided as an option', () => {
      const promises = [];

      const invalidNames = [
        '_invalid',
        '.invalid',
        { invalid: 'invalid' },
        '@/invalid',
        'invalid@name',
        'invalid because of spaces'
      ];

      for (const name of invalidNames) {
        let threw = false;

        promises.push(
          helpers.run(require.resolve('../generators/app'))
            .withOptions({ name: name })
            .catch(() => threw = true)
            .then(() => assert.ok(threw, `Uh-oh, it allowed the following invalid name: ${name}`))
        );
      }

      return Promise.all(promises);
    });
  });
});
