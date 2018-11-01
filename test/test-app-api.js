'use strict';
const helpers       = require('yeoman-test');
const assert        = require('yeoman-assert');

function bootstrapRunner() {
  return helpers.run(require.resolve('../generators/app/api'));
}

describe('tabdigital-node:app:api', () => {

  describe('generating api files', () => {

    it('generates api service', () => {
      const options = {
        projectRoot: 'src',
        api: true
      };

      return bootstrapRunner()
        .withOptions(options)
        .then(() => {
          assert.file([
            'package.json',
            'src/bootstraps/api-service/index.js',
            'src/bootstraps/api-service/server.js',
            'src/utils/ApiError.js',
            'src/components/index.js',
            'src/components/router.js',
            'src/components/swagger.js',
            'src/components/hello-world/routes.js',
            'src/components/hello-world/controller.js',
            'src/components/status/routes.js',
            'src/components/status/controller.js',
          ]);

          assert.jsonFileContent(
            'package.json',
            {
              'dependencies': {
                '@tabdigital/api-error': '0.0.2',
                '@tabdigital/api-middleware': '^3.0.0',
                '@tabdigital/connect-router': '^5.0.0',
                'restify': '^7.2.1',
                'restify-errors': '^6.1.1',
              }
            }
          );

        });
    });
  });
});
