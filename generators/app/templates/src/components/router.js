'use strict';

const connectRouter = require('@tabdigital/connect-router');
const components    = require('./');
const swagger       = require('./swagger');

function registerSwaggerRoutes(router) {
  router.get({
    name: 'swagger-json',
    path: '/swagger.json',
    handlers: [(req, res) => res.send(toSwagger())],
  });
}

function toSwagger() {
  const router = connectRouter();
  components.register(router);
  return router.toSwagger(swagger.info);
}

function create(server) {
  const router = connectRouter();
  registerSwaggerRoutes(router);
  components.register(router, server);

  return router;
}

module.exports = {
  create,
};