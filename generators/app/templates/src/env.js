'use strict';

require('dotenv').config();
const pkg = require('../package.json');
const strummer = require('strummer');

const requiredConfigFields = new strummer.object({
  log: {
    logLevel: new strummer.string()
  },
  apiServer: {
    publicUrl: new strummer.string(),
    serverPort: strummer.number({parse: true}),
  }
});

const env = {};

env.pkg = {
  name: pkg.name,
  version: pkg.version,
  description: pkg.description,
};

env.version = {
  releaseVersion: process.env.RELEASE_VERSION,
};

env.log = {
  logFile: process.env.LOG_FILE,
  logLevel: process.env.LOG_LEVEL || 'info',
};

env.debug = {
  showStackTrace: process.env.SHOW_STACK_TRACE,
};

env.apiServer = {
  publicUrl: process.env.PUBLIC_URL || 'localhost',
  serverPort: process.env.SERVER_PORT || 8080,
};

const errors = requiredConfigFields.match(env);
if (errors.length > 0) {
  throw new Error(`Environment variable validation failed, error: ${JSON.stringify(errors)}`);
}

module.exports = env;
