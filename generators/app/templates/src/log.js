'use strict';

const APILogger = require('@tabdigital/api-logger');
const env = require('./env');

module.exports = new APILogger({
  level: env.log.logLevel,
  name: env.pkg.name
});
