'use strict';
const helpers       = require('yeoman-test');
const assert        = require('yeoman-assert');

function generatorPromise() {
  const answers = {
    name: 'some-test',
    description: 'a test project',
    authorName: 'fred flinstone',
    authorEmail: 'fred.flinstone@bedrock.org',
    keywords: ['foo', 'bar'],
    devseed: false,
    cli: false,
    eslint: true,
  };

  return helpers.run(require.resolve('../generators/eslint'))
    .withPrompts(answers);
}

describe('tabdigital-node:eslint', () => {
  describe(':eslint', () => {
    it('configures npm eslint script', () => {
      return generatorPromise().then(() => {
        assert.jsonFileContent(
          'package.json',
          {
            scripts: {
              'lint': 'eslint --ignore-path .gitignore --ext .js .',
            },
            devDependencies: {
              'eslint': '^5.1.0',
            },
          }
        );
      });
    });

    describe('configures eslintrc config', () => {
      it ('includes a no-multiple-empty-lines configuration', () => {
        return generatorPromise().then(() => {
          assert.jsonFileContent(
            '.eslintrc.json',
            {
              'rules': {
                'no-multiple-empty-lines': ['error', { 'maxEOF': 1, 'max': 1}]
              }
            }
          );
        });
      });
    });
  });
});
