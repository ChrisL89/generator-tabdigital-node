#!/usr/bin/env bash

echo "--- Configuring NVM"
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

nvm use || nvm install
echo "--- Initialising Dependencies"
npm install

echo "--- Linting..."
npm run lint

echo "--- Running tests..."
npm test
