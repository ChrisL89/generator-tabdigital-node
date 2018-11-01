
'use strict';
const helpers       = require('yeoman-test');
const assert        = require('yeoman-assert');

function bootstrapRunner() {
  return helpers.run(require.resolve('../generators/nvm'));
}

describe('tabdigital-node:nvm', () => {
  describe(':nvm', () => {
    it('creates defualt .nvmrc', () => {
      const answer = {
        nodeVersion: '8.6.0'
      };
      return bootstrapRunner()
        .withPrompts(answer)
        .then(() => {
          assert.fileContent([
            [
              '.nvmrc',
              '8.6.0'
            ],
          ]);
        });
    });

    it('creates specific version .nvmrc', () => {
      const answer = {
        nodeVersion: '10.1.0'
      };
      return bootstrapRunner()
        .withPrompts(answer)
        .then(() => {
          assert.fileContent([
            [
              '.nvmrc',
              '10.1.0'
            ],
          ]);
        });
    });
  });
});
