'use strict';

const controller = require('./controller');

function register(router) {
  router.get({
    name: 'hello-world',
    path: '/hello-world',
    handlers: [controller.helloWorld]
  });
}

module.exports = {
  register
};
