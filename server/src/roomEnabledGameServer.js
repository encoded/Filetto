// @src/roomEnabledGameServer.js
const GameServer = require('./gameServer');
const RoomManager = require('./roomManager');
const { CLIENT_TO_SERVER, SERVER_TO_CLIENT } = require('@shared/messages');

class RoomEnabledGameServer extends GameServer {
  constructor(port) {
    super(port);
    this.roomManager = new RoomManager();
    this.clientRooms = new Map(); // ws -> roomName
    this.pendingJoins = new Map(); // ws -> { name, gameType, mode }
  }

  onClientConnect(ws) {
    // No-op here, wait for specific messages
  }

  onClientDisconnect(ws) {
    const roomName = this.clientRooms.get(ws);
    if (roomName) {
      const room = this.roomManager.getRoom(roomName);
      if (room) {
        room.removeClient(ws);
      }
      this.clientRooms.delete(ws);
    }
    this.roomManager.removePlayerSearchingForRoom(ws);
    this.pendingJoins.delete(ws);
  }

  onClientMessage(ws, data) {
    switch (data.type) {
      case CLIENT_TO_SERVER.CREATE_ROOM:
        const { gameType, mode } = data;
        const createdRoom = this.roomManager.createRoomWithOwner(ws, gameType, mode);
        this.clientRooms.set(ws, createdRoom.roomName);
        ws.send(JSON.stringify({ 
          type: SERVER_TO_CLIENT.ROOM_CREATED, 
          roomName: createdRoom.roomName,
          isOwner: true,
          mode
        }));
        break;

      case CLIENT_TO_SERVER.FIND_RANDOM_ROOM:
        // Start searching immediately without requiring name
        ws.send(JSON.stringify({ type: SERVER_TO_CLIENT.SEARCHING_FOR_ROOM }));
        this.roomManager.addPlayerSearchingForRoom(ws, 'filetto', 'player');
        break;

      case CLIENT_TO_SERVER.SET_PLAYER_INFO:
        this.pendingJoins.set(ws, { 
          name: data.name,
          gameType: data.gameType || 'filetto',
          mode: data.mode || 'player'
        });
        break;

      case CLIENT_TO_SERVER.ENTER_ROOM:
        const targetRoom = this.roomManager.getRoom(data.roomName);
        if (!targetRoom) {
          ws.send(JSON.stringify({ type: SERVER_TO_CLIENT.ROOM_FOUND, found: false }));
          return;
        }
        ws.send(JSON.stringify({ type: SERVER_TO_CLIENT.ROOM_FOUND, found: true }));
        this.clientRooms.set(ws, data.roomName);
        targetRoom.addClient(ws, 'player');
        break;

      case CLIENT_TO_SERVER.JOIN:
        const joinRoomName = this.clientRooms.get(ws);
        if (joinRoomName) {
          const currentRoom = this.roomManager.getRoom(joinRoomName);
          if (currentRoom) {
            currentRoom.handleMessage(ws, data);
          }
        }
        break;

      default:
        // Forward other messages to the appropriate room
        const defaultRoomName = this.clientRooms.get(ws);
        if (defaultRoomName) {
          const room = this.roomManager.getRoom(defaultRoomName);
          if (room) {
            room.handleMessage(ws, data);
          }
        }
    }
  }
}

module.exports = RoomEnabledGameServer;
