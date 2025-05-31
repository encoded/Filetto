require('module-alias/register');

const RoomEnabledGameServer = require('./src/roomEnabledGameServer');

const PORT = 3000;
const server = new RoomEnabledGameServer(PORT);
