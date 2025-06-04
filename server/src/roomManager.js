const { nanoid } = require('nanoid');
const FilettoGameRoom = require('./filettoGameRoom');

class RoomManager {
  constructor() {
    this.rooms = new Map(); // roomName -> roomInstance
    this.playersSearchingForRoom = new Set(); // Set of websocket connections looking for a room
  }

  getOrCreateRoom(roomName) {
    if (!this.rooms.has(roomName)) {
      const room = new FilettoGameRoom({
        onEmpty: () => this.removeRoom(roomName),
      });
      this.rooms.set(roomName, room);
    }
    return this.rooms.get(roomName);
  }

  getRoom(roomName) {
    return this.rooms.get(roomName);
  }

  createRoomWithUniqueCode() {
    let code;
    do {
      code = nanoid(6); // Generate a short room code like 'a1b2c3'
    } while (this.rooms.has(code));

    const room = new FilettoGameRoom({
      onEmpty: () => this.removeRoom(code),
    });

    this.rooms.set(code, room);
    return { roomName: code, room };
  }

  removeRoom(roomName) {
    this.rooms.delete(roomName);
    console.log(`Room "${roomName}" removed from manager.`);
  }

  addPlayerSearchingForRoom(ws) {
    this.playersSearchingForRoom.add(ws);
    this.tryMatchPlayers();
  }

  removePlayerSearchingForRoom(ws) {
    this.playersSearchingForRoom.delete(ws);
  }

  tryMatchPlayers() {
    if (this.playersSearchingForRoom.size >= 2) {
      // Get two players from the set
      const [player1, player2] = [...this.playersSearchingForRoom].slice(0, 2);
      
      // Create a new room for them
      const { roomName, room } = this.createRoomWithUniqueCode();
      
      // Remove them from searching list
      this.playersSearchingForRoom.delete(player1);
      this.playersSearchingForRoom.delete(player2);

      // Add them to the room
      room.addClient(player1);
      room.addClient(player2);

      // Notify both players
      [player1, player2].forEach(player => {
        player.send(JSON.stringify({ 
          type: 'ROOM_FOUND',
          roomName 
        }));
      });
    }
  }
}

module.exports = RoomManager;
