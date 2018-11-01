'use strict';
const helpers       = require('yeoman-test');
const assert        = require('yeoman-assert');

function bootstrapRunner() {
  return helpers.run(require.resolve('../generators/app/source'));
}

describe('tabdigital-node:app:source', () => {

  describe('generating source files', () => {

    it('generates base src files without api service', () => {
      const options = {
        projectRoot: 'src',
      };
      const answers = {
        api: false,
      };

      return bootstrapRunner()
        .withOptions(options)
        .withPrompts(answers)
        .then(() => {
          assert.file([
            'package.json',
            'src/index.js',
            'src/start.js',
            'src/env.js',
            'src/log.js',
            'src/bootstraps/api-service'
          ]);

          assert.noFile([
            'src/components/hello-world'
          ]);

          assert.jsonFileContent(
            'package.json',
            {
              'dependencies': {
                '@tabdigital/api-logger': '^3.1.0',
                'async': '^2.6.1',
                'dotenv': '^6.0.0'
              }
            }
          );

          assert.fileContent(
            'src/start.js',
            'const apiService = require(\'./bootstraps/api-service\');',
            'next => apiService(next),'
          );
        });
    });

    it('generates base src files with api service', () => {
      const options = {
        projectRoot: 'src',
      };
      const answers = {
        api: true,
      };

      return bootstrapRunner()
        .withOptions(options)
        .withPrompts(answers)
        .then(() => {
          assert.file([
            'package.json',
            'src/index.js',
            'src/start.js',
            'src/env.js',
            'src/log.js',
            'src/bootstraps/api-service',
            'src/components/hello-world'
          ]);

          assert.jsonFileContent(
            'package.json',
            {
              'dependencies': {
                '@tabdigital/api-logger': '^3.1.0',
                'async': '^2.6.1',
                'dotenv': '^6.0.0',
              }
            }
          );

          assert.fileContent(
            'src/start.js',
            'const apiService = require(\'./bootstraps/api-service\');',
            'next => apiService(next),'
          );
        });
    });
  });
});
