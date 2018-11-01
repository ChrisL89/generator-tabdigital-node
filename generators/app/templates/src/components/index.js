'use strict';

const register = (router, server) => {
  <% if(apiEnabled) { -%>
  require('./hello-world/routes').register(router, server);
  <% } -%>
  require('./status/routes').register(router);
};

module.exports = {
  register
};
