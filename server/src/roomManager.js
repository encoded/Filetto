const { nanoid } = require('nanoid');
const FilettoGameRoom = require('./filettoGameRoom');

class RoomManager {
  constructor() {
    this.rooms = new Map(); // roomName -> roomInstance
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
}

module.exports = RoomManager;
