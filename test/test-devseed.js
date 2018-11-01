'use strict';
const helpers       = require('yeoman-test');
const assert        = require('yeoman-assert');

function generatorPromise() {
  return helpers.run(require.resolve('../generators/devseed'));
}

describe('tabdigital-node:devseed', () => {
  describe(':devseed', () => {
    it('initialises dev seed npm dependency', () => {
      return generatorPromise()
        .withPrompts({
          repositoryName: 'some-package'
        })
        .then(() => {
          assert.jsonFileContent(
            'package.json',
            {
              'devDependencies': {
                '@tabdigital/dev-seed': '^1.0.3'
              }
            }
          );
        });
    });

    it('configures npm seed scripts', () => {
      return generatorPromise().then(() => {
        assert.jsonFileContent(
          'package.json',
          {
            'scripts': {
              'build-dev-seed': 'dev-seed build',
              'start-dev-seed': 'dev-seed start',
              'restart-dev-seed': 'dev-seed restart',
              'stop-dev-seed': 'dev-seed stop',
              'tail-dev-seed': 'dev-seed tail',
              'clean-dev-seed': 'dev-seed clean',
            },
          }
        );
      });
    });

    it('bootstraps dev seed config.yaml', () => {
      return generatorPromise().then(() => {
        assert.fileContent([
          ['dev-seed/config.yaml', 'services:'],
          ['dev-seed/config.yaml', '- name: api-service-gateway'],
          ['dev-seed/config.yaml', 'branch: green-moon'],
        ]);
      });

    });
  });
});
