#!/usr/bin/env node
'use strict';

const <%= packageSafeName %> = require('./');
const meow = require('meow');

const cli = meow(`
Usage
  $ <%= packageName %> [input]

Options
  --example   Example Input. [Default: false]

Examples
  $ <%= packageName %> --example=true bar
`);

<%= packageSafeName %>(cli.input[0], cli.flags);
