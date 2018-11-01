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
    repositoryName: 'some-test',
    devseed: false,
    cli: false,
    eslint: false,
  };

  return helpers.run(require.resolve('../generators/git'))
    .withPrompts(answers);
}

describe('tabdigital-node:git', () => {
  describe(':git', () => {
    it('creates .gitignore configuration', () => {
      return generatorPromise().then(() => {
        assert.file('.gitignore');
      });
    });

    it('creates git config', () => {
      return generatorPromise().then(() => {
        assert.file('.git/config');
      });
    });

    it('creates and configures git remotes', () => {
      return generatorPromise().then(() => {
        assert.fileContent([
          ['.git/config', '[remote "origin"]'],
          ['.git/config', 'url = git@github.tabcorp.com.au:TabDigital/some-test.git'],
        ]);
      });
    });
  });
});
