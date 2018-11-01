'use strict';

function helloWorld(req, res, next) {
  res.send('Hello World!');
  next();
}

module.exports = {
  helloWorld,
};
