const { SERVER_TO_CLIENT, SERVER_TO_ALL } = require('@shared/messages');
const { getClientSanitisedIp } = require('./utils');

class BaseGameRoom {
  constructor({ onEmpty, roomName } = {}) {
    this.players = [];
    this.gameStarted = false;
    this.owner = null;
    this.playMode = null; // 'presenter' or 'player'
    this.settings = {}; // Game-specific settings
    this.onEmpty = onEmpty;
    this.pendingClients = new Set(); // Clients that haven't set their names yet
    this.roomName = roomName;
  }

  setOwner(ws, mode) {
    this.owner = ws;
    this.playMode = mode;
    this.broadcastPlayerStatus();
  }

  isOwner(ws) {
    return this.owner === ws;
  }

  transferOwnership() {
    // Transfer to the first remaining player if any
    const remainingPlayer = this.players[0]?.ws;
    if (remainingPlayer) {
      this.owner = remainingPlayer;
      // Keep the same play mode
      return true;
    }

    // No one left to be owner
    this.owner = null;
    this.playMode = null;
    return false;
  }

  addClient(ws, mode, isOwner = false) {
    // Only check max players for non-presenter clients
    if (mode !== 'presenter' && this.players.length >= this.getMaxPlayers() && !this.pendingClients.has(ws)) {
      ws.send(JSON.stringify({ type: SERVER_TO_CLIENT.ROOM_FULL }));
      ws.close();
      return;
    }

    if (isOwner) {
      this.setOwner(ws, mode);
    }

    // Only add to pending clients if they're not a presenter
    if (mode !== 'presenter') {
      this.pendingClients.add(ws);
      ws.send(JSON.stringify({ type: SERVER_TO_CLIENT.WAITING_FOR_NAME }));
    } else if (isOwner) {
      // If they're a presenter and owner, send join success immediately
      // WE DO NOT SEND HERE THE PLAYER ID BECAUSE PRESENTER IS NOT A PLAYER
      ws.send(JSON.stringify({
        type: SERVER_TO_CLIENT.JOIN_SUCCESS,
        isOwner: true,
        playMode: mode,
        settings: this.settings,
        roomName: this.roomName
      }));
      this.broadcastPlayerStatus();
    }
  }

  removeClient(ws) {
    const wasPlayer = this.players.find(p => p.ws === ws);
    const wasOwner = this.isOwner(ws);

    if (wasPlayer) {
      this.players = this.players.filter(p => p.ws !== ws);
      this.broadcastMessage({ type: SERVER_TO_ALL.PLAYER_LEFT });
    }

    if (wasOwner) {
      if (this.transferOwnership()) {
        this.broadcastPlayerStatus();
      }
    }

    this.pendingClients.delete(ws);

    if (this.players.length === 0 && typeof this.onEmpty === 'function') {
      this.onEmpty();
    }

    this.resetGame();
  }

  handleJoin(ws, name) {
    if (!this.pendingClients.has(ws)) return;
    if (this.players.find(p => p.ws === ws)) return;

    const id = getClientSanitisedIp(ws);
    if (this.players.find(p => p.id === id)) {
      ws.send(JSON.stringify({ type: SERVER_TO_CLIENT.JOIN_ERROR, message: 'Player already in room' }));
      return;
    }

    const player = this.createPlayer(ws, name, id);
    this.players.push(player);
    this.pendingClients.delete(ws);

    ws.send(JSON.stringify({
      type: SERVER_TO_CLIENT.JOIN_SUCCESS,
      name,
      isOwner: this.isOwner(ws),
      playMode: this.playMode,
      settings: this.settings,
      playerId: id,
      roomName: this.roomName
    }));

    this.broadcastPlayerStatus();
  }

  broadcastPlayerStatus() {
    this.broadcastMessage({
      type: SERVER_TO_ALL.READY_STATUS,
      players: this.players.map(p => ({
        id: p.id,
        name: p.name,
        ready: p.ready,
        isOwner: this.isOwner(p.ws)
      })),
      playMode: this.playMode,
      settings: this.settings,
      roomName: this.roomName
    });
  }

  broadcastMessage(msgObj) {
    const message = JSON.stringify(msgObj);
    const allConnections = this.getAllSockets();

    for (const ws of allConnections) {
      if (ws.readyState === ws.OPEN) {
        ws.send(message);
      }
    }
  }

  getAllSockets() {
    const sockets = [...this.players.map(p => p.ws), ...this.pendingClients];
    if (this.owner && this.playMode === 'presenter' && !sockets.includes(this.owner)) {
      sockets.push(this.owner);
    }
    return sockets;
  }

  // Methods to be implemented by specific game rooms
  getMaxPlayers() {
    throw new Error('getMaxPlayers must be implemented by child class');
  }

  createPlayer(ws, name, id) {
    throw new Error('createPlayer must be implemented by child class');
  }

  resetGame() {
    throw new Error('resetGame must be implemented by child class');
  }

  updateSettings(settings) {
    this.settings = { ...this.settings, ...settings };
    this.broadcastPlayerStatus();
  }
}

module.exports = BaseGameRoom; 