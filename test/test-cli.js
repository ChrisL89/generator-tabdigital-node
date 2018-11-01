'use strict';
const helpers       = require('yeoman-test');
const assert        = require('yeoman-assert');

describe('tabdigital-node:cli', () => {
  describe(':cli', () => {
    beforeEach(() => {
      return helpers.run(require.resolve('../generators/cli'))
        .on('ready', generator => {
          generator.fs.write(generator.destinationPath('package.json'), JSON.stringify({ name: 'some-package' }));
        });
    });

    it('creates cli.js', () => {
      assert.fileContent([
        [
          'src/cli.js',
          'const somePackage = require(\'./\')'
        ],
        [
          'src/cli.js',
          'const meow = require(\'meow\')',
        ],
        [
          'src/cli.js',
          `
const cli = meow(\`
Usage
  $ some-package [input]

Options
  --example   Example Input. [Default: false]

Examples
  $ some-package --example=true bar
\`);`,
        ],
      ]);
    });

    it('successfully updates package.json with dependencies and scripts', () => {
      assert.jsonFileContent(
        'package.json',
        {
          bin: 'src/cli.js',
          dependencies: {
            meow: '^5.0.0'
          },
          devDependencies: {
            lec: '^1.0.1'
          },
          scripts: {
            prepare: 'lec src/cli.js -c LF'
          }
        }
      );
    });
  });
});
