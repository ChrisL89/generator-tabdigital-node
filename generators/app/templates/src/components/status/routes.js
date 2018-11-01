'use strict';

const controller = require('./controller');

function register(router) {
  router.get({
    name: 'status',
    path: '/status',
    handlers: [controller.get],
  });

  router.get({
    name: 'status-details',
    path: '/status/details',
    handlers: [controller.details],
  });
}

module.exports = {
  register
};
