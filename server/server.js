// @src/index.js
require('module-alias/register');
const FilettoGameServer = require('@src/filettoGameServer');

new FilettoGameServer(3000);
