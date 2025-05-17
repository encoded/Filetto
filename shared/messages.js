// @shared/messages.js

// Messages sent to server
const CLIENT_TO_SERVER = {
  JOIN: 'JOIN',
  READY: 'READY',
  MAKE_MOVE: 'MAKE_MOVE',
};

// Messages broadcasted to all clients
const SERVER_TO_CLIENT = {
  ROOM_FULL: 'ROOM_FULL',
  JOIN_SUCCESS: 'JOIN_SUCCESS',
  INVALID_MOVE: 'INVALID_MOVE',
  WAITING_FOR_NAME: 'WAITING_FOR_NAME',
};

// Messages broadcasted to all clients
const SERVER_TO_ALL = {
  WAITING_FOR_READY: 'WAITING_FOR_READY',
  READY_STATUS: 'READY_STATUS',
  GAME_START: 'GAME_START',
  MOVE_MADE: 'MOVE_MADE',
  GAME_END: 'GAME_END',
  PLAYER_LEFT: 'PLAYER_LEFT',
};

module.exports = {
  CLIENT_TO_SERVER,
  SERVER_TO_CLIENT,
  SERVER_TO_ALL,
};
