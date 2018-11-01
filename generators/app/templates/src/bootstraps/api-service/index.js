'use strict';

const env = require('../../env');
const server = require('./server');
const log = require('../../log');

function service(next) {
  const app = server.create();
  app.listen(env.apiServer.serverPort, next);

  log.info(`API Service is available at ${env.apiServer.publicUrl}:${env.apiServer.serverPort}`);
}

module.exports = service;
