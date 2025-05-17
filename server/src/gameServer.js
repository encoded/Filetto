// @src/gameServer.js
const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const os = require('os');

class GameServer {
  constructor(port = 3000) {
    this.port = port;
    this.app = express();
    this.server = http.createServer(this.app);
    this.wss = new WebSocket.Server({ server: this.server });

    this.setupServer();
    this.setupWebSocket();
  }

  getLocalIPAddress() {
    const interfaces = os.networkInterfaces();
    for (let iface in interfaces) {
      for (let i = 0; i < interfaces[iface].length; i++) {
        const ifaceInfo = interfaces[iface][i];
        if (ifaceInfo.family === 'IPv4' && !ifaceInfo.internal) {
          return ifaceInfo.address;
        }
      }
    }
    return 'localhost';
  }

  setupServer() {
    this.app.use(express.static('public'));
    this.server.listen(this.port, () => {
      const localIp = this.getLocalIPAddress();
      console.log(`Server running at http://${localIp}:${this.port}`);
    });
  }

  setupWebSocket() {
    this.wss.on('connection', (ws) => {
      console.log('Client connected');
      this.onClientConnect(ws);

      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          this.onClientMessage(ws, data);
        } catch (err) {
          console.error('Invalid message format:', message);
        }
      });

      ws.on('close', () => {
        this.onClientDisconnect(ws);
      });
    });
  }

  broadcastMessage(messageObj) {
    const message = JSON.stringify(messageObj);
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  // Empty stubs for subclass to implement
  onClientConnect(ws) {}
  onClientMessage(ws, data) {}
  onClientDisconnect(ws) {}
}

module.exports = GameServer;
