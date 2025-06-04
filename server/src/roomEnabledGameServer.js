// @src/roomEnabledGameServer.js
const GameServer = require('./gameServer');
const RoomManager = require('./roomManager');
const { CLIENT_TO_SERVER, SERVER_TO_CLIENT } = require('@shared/messages');

class RoomEnabledGameServer extends GameServer {
  constructor(port) {
    super(port);
    this.roomManager = new RoomManager();
    this.clientRooms = new Map(); // ws -> roomName
  }

  onClientConnect(ws) {
    // No-op here, wait for JOIN_ROOM message
  }

  onClientMessage(ws, data) {
    if (data.type === CLIENT_TO_SERVER.CREATE_LOCAL_ROOM) {
      const { roomName, room } = this.roomManager.createRoomWithUniqueCode();
      this.clientRooms.set(ws, roomName);
      room.addHost(ws); // we add host here

      ws.send(JSON.stringify({ type: SERVER_TO_CLIENT.ROOM_CREATED, roomName }));
      return;
    }

    if (data.type === CLIENT_TO_SERVER.FIND_RANDOM_ROOM) {
      ws.send(JSON.stringify({ type: SERVER_TO_CLIENT.SEARCHING_FOR_ROOM }));
      this.roomManager.addPlayerSearchingForRoom(ws);
      return;
    }

    if (data.type === CLIENT_TO_SERVER.JOIN_ROOM) {
      const { roomName } = data;
      const room = this.roomManager.getOrCreateRoom(roomName);
      this.clientRooms.set(ws, roomName);
      room.addClient(ws);
      return;
    }

    // Only proceed if client is already associated with a room
    const roomName = this.clientRooms.get(ws);
    const room = this.roomManager.getRoom(roomName);

    if (room) {
      room.handleMessage(ws, data);
    } else {
      ws.send(JSON.stringify({ type: 'ERROR', message: 'No room found for message type: ' + data.type }));
    }
  }

  onClientDisconnect(ws) {
    const roomName = this.clientRooms.get(ws);
    const room = this.roomManager.getRoom(roomName);
    if (room) {
      room.removeClient(ws);
    }
    this.clientRooms.delete(ws);
    this.roomManager.removePlayerSearchingForRoom(ws);
  }
}

module.exports = RoomEnabledGameServer;
