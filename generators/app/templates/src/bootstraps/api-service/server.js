'use strict';

const apiMiddleware = require('@tabdigital/api-middleware');
const restify       = require('restify');
const restifyErrors = require('restify-errors');
const router        = require('../../components/router');
const env           = require('../../env');
const log           = require('../../log');
const ApiError      = require('../../utils/ApiError');

exports.create = function () {
  const server = restify.createServer({
    name: env.pkg.name,
    formatters: {
      'application/json': function (req, res, body) {
        if (body.error && !env.debug.showStackTrace) {
          delete body.error.stack;
        }
        return JSON.stringify(body);
      },
    },
    handleUncaughtExceptions: true,
    ignoreTrailingSlash: true,
  });

  server.on('uncaughtException', (req, res, route, err) => {
    log.error(`<%= packageName %>:uncaught-exception:error:${String(err)}`);
    if (res._header) { // eslint-disable-line no-underscore-dangle
      res.end();
    } else {
      res.send(503, new restifyErrors.InternalError('Service not available'));
    }
  });

  server.pre(restify.pre.sanitizePath());

  server.use(restify.plugins.fullResponse());
  server.use(restify.plugins.gzipResponse());
  server.use(restify.plugins.bodyParser({mapParams: false}));
  server.use(restify.plugins.queryParser({mapParams: false}));

  server.use(apiMiddleware.plainTextParser());
  server.use(apiMiddleware.cache({ defaultMaxAge: 0 }));
  server.use(apiMiddleware.hypermedia(server.router, env.apiServer.publicUrl));
  server.on('BadRequest', function (req, res, err, next) {
    res.send(400, {
      error: ApiError({
        code: 'VALIDATION_ERROR',
        message: err.message,
        details: err.fields.details,
      }),
    });
    next();
  });

  router.create(server).mountRestify(server);
  return server;
};
