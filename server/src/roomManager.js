const { nanoid } = require('nanoid');
const FilettoGameRoom = require('./filettoGameRoom');

class RoomManager {
  constructor() {
    this.rooms = new Map(); // roomName -> roomInstance
    this.playersSearchingForRoom = new Map(); // ws -> { gameType, mode }
  }

  getOrCreateRoom(roomName, gameType = 'filetto') {
    if (!this.rooms.has(roomName)) {
      const room = this.createGameRoom(gameType, {
        roomName: roomName,
        onEmpty: () => this.removeRoom(roomName),
      });
      this.rooms.set(roomName, room);
    }
    return this.rooms.get(roomName);
  }

  getRoom(roomName) {
    return this.rooms.get(roomName);
  }

  createRoomWithOwner(ws, gameType, mode) {
    const code = this.generateUniqueCode();
    const room = this.createGameRoom(gameType, {
      roomName: code,
      onEmpty: () => this.removeRoom(code),
    });

    this.rooms.set(code, room);
    room.addClient(ws, mode, true); // Add as owner
    return { roomName: code, room };
  }

  generateUniqueCode() {
    let code;
    do {
      code = nanoid(6); // Generate a short room code like 'a1b2c3'
    } while (this.rooms.has(code));
    return code;
  }

  removeRoom(roomName) {
    this.rooms.delete(roomName);
    console.log(`Room "${roomName}" removed from manager.`);
  }

  addPlayerSearchingForRoom(ws, gameType, mode) {
    this.playersSearchingForRoom.set(ws, { gameType, mode });
    this.tryMatchPlayers(gameType);
  }

  removePlayerSearchingForRoom(ws) {
    this.playersSearchingForRoom.delete(ws);
  }

  tryMatchPlayers(gameType) {
    const searchingPlayers = Array.from(this.playersSearchingForRoom.entries())
      .filter(([_, data]) => data.gameType === gameType)
      .map(([ws, data]) => ({ ws, mode: data.mode }));

    if (searchingPlayers.length >= 2) {
      // Get two players from the set
      const [player1, player2] = searchingPlayers.slice(0, 2);
      
      // Create a new room
      const code = this.generateUniqueCode();
      const room = this.createGameRoom(gameType, {
        roomName: code,
        onEmpty: () => this.removeRoom(code),
      });
      
      this.rooms.set(code, room);
      
      // Remove them from searching list
      this.playersSearchingForRoom.delete(player1.ws);
      this.playersSearchingForRoom.delete(player2.ws);

      // Add them to the room (no owner in random matchmaking)
      room.addClient(player1.ws, player1.mode);
      room.addClient(player2.ws, player2.mode);

      // Notify both players
      [player1.ws, player2.ws].forEach(ws => {
        ws.send(JSON.stringify({ 
          type: 'ROOM_FOUND',
          roomName: code
        }));
      });
    }
  }

  createGameRoom(gameType, options) {
    switch (gameType.toLowerCase()) {
      case 'filetto':
        return new FilettoGameRoom(options);
      // Add more game types here
      default:
        throw new Error(`Unknown game type: ${gameType}`);
    }
  }
}

module.exports = RoomManager;
