'use strict';

module.exports = {
  app:      require.resolve('./generators/app'),
  git:      require.resolve('./generators/git'),
  devseed:  require.resolve('./generators/devseed'),
  eslint:   require.resolve('./generators/eslint'),
  cli:      require.resolve('./generators/cli'),
  nvm:      require.resolve('./generators/nvm'),
};
