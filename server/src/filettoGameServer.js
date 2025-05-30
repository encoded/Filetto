const GameServer = require('./gameServer');
const FilettoGame = require('@shared/filettoGame');
const {
  CLIENT_TO_SERVER,
  SERVER_TO_CLIENT,
  SERVER_TO_ALL,
} = require('@shared/messages');

const QuizManager = require('./quizManager');
const quizData = require('@data/tempQuizData'); // your quiz questions
const { getClientSanitisedIp } = require('@src/utils');
const { fetchQuiz } = require('./quizProvider'); // adjust path as needed

class FilettoGameServer extends GameServer {
  constructor(port) {
    super(port);
    this.players = [];
    this.game = new FilettoGame();
    this.gameStarted = false;

    this.quizManager = null;
    this.quizMode = false;
    this.pendingMove = null;
  }

  onClientConnect(ws) {
    const existingPlayer = this.players.find(p => p.ws === ws);
    if (existingPlayer) {
      ws.send(JSON.stringify({
        type: SERVER_TO_CLIENT.JOIN_SUCCESS,
        symbol: existingPlayer.symbol,
        name: existingPlayer.name,
      }));

      if (this.players.length === 2) {
        this.broadcastMessage({
          type: SERVER_TO_ALL.WAITING_FOR_READY,
          players: this.players.map(p => ({ name: p.name, ready: p.ready, symbol: p.symbol })),
        });
      }
      return;
    }

    if (this.players.length >= 2) {
      ws.send(JSON.stringify({ type: SERVER_TO_CLIENT.ROOM_FULL }));
      ws.close();
      return;
    }

    ws.send(JSON.stringify({ type: SERVER_TO_CLIENT.WAITING_FOR_NAME }));
  }

  onClientMessage(ws, data) {
    switch (data.type) {
      case CLIENT_TO_SERVER.JOIN:
        this.handleJoin(ws, data.name);
        break;
      case CLIENT_TO_SERVER.READY:
        this.handleReady(ws);
        break;
      case CLIENT_TO_SERVER.MAKE_MOVE:
        this.handleMove(ws, data.cellIndex);
        break;
      case CLIENT_TO_SERVER.SUBMIT_ANSWER:
        if (this.quizManager) {
          this.quizManager.receiveAnswer(ws, data.selectedIndex);
        }
        break;
      default:
        console.warn('Unknown message type:', data.type);
    }
  }

  onClientDisconnect(ws) {
    this.players = this.players.filter(p => p.ws !== ws);
    this.broadcastMessage({ type: SERVER_TO_ALL.PLAYER_LEFT });
    this.resetGame();
  }

  handleJoin(ws, name) {
    if (this.players.find(p => p.ws === ws)) return;
    if (this.players.find(p => p.name === name)) {
      ws.send(JSON.stringify({ type: SERVER_TO_CLIENT.JOIN_ERROR, message: 'Name already taken' }));
      return;
    }

    const symbol = this.players.length === 0 ? 'X' : 'O';
    const player = { ws, name, ready: false, symbol };
    this.players.push(player);

    ws.send(JSON.stringify({
      type: SERVER_TO_CLIENT.JOIN_SUCCESS,
      symbol,
      name,
    }));

    if (this.players.length === 2) {
      this.broadcastMessage({
        type: SERVER_TO_ALL.WAITING_FOR_READY,
        players: this.players.map(p => ({ name: p.name, ready: p.ready, symbol: p.symbol })),
      });
    }
  }

  handleReady(ws) {
    const player = this.players.find(p => p.ws === ws);
    if (!player) return;

    player.ready = true;

    this.broadcastMessage({
      type: SERVER_TO_ALL.READY_STATUS,
      players: this.players.map(p => ({ name: p.name, ready: p.ready, symbol: p.symbol })),
    });

    if (this.players.length === 2 && this.players.every(p => p.ready)) {
      this.startGame();
    }
  }

  startGame() {
    this.game.reset();
    this.gameStarted = true;

    const currentSymbol = this.game.getCurrentSymbol();

    this.broadcastMessage({
      type: SERVER_TO_ALL.GAME_START,
      board: this.game.getBoard(),
      currentTurn: currentSymbol,
      players: this.players,
    });
  }

  handleMove(ws, cellIndex) {
    if (!this.gameStarted || this.quizMode) return;

    const player = this.players.find(p => p.ws === ws);
    if (!player || player.symbol !== this.game.getCurrentSymbol()) {
      ws.send(JSON.stringify({ type: SERVER_TO_CLIENT.INVALID_MOVE, message: 'Not your turn' }));
      return;
    }

    // Store the move and start quiz before actually processing move
    this.pendingMove = { ws, cellIndex };
    this.startQuiz(ws);
  }

  async startQuiz(ws) {
    this.quizMode = true;

    try {
      // add params here for the quiz
      const params = {
        numQuestions: 1,
        type: 'multiple',
        difficulty: 'easy',
        category: 9, // General Knowledge
      };
      const question = await fetchQuiz(params);

      this.quizManager = new QuizManager(
        this.wss,
        question,
        ws,
        10,
        (passed) => {
          this.quizMode = false;

          // Delay before continuing the game
          setTimeout(() => {
            if (passed) {
              const { ws: moveWs, cellIndex } = this.pendingMove;
              this.pendingMove = null;
              this.processApprovedMove(moveWs, cellIndex);
            } else {
              // Switch turn manually
              const currentSymbol = this.game.getCurrentSymbol();
              const nextSymbol = currentSymbol === 'X' ? 'O' : 'X';
              this.game.currentSymbol = nextSymbol;

              const board = this.game.getBoard();
              this.broadcastMessage({
                type: SERVER_TO_ALL.MOVE_MADE,
                board,
                currentTurn: nextSymbol,
              });

              this.pendingMove.ws.send(JSON.stringify({
                type: SERVER_TO_CLIENT.INVALID_MOVE,
                message: 'Quiz failed. Move not allowed.',
              }));

              this.pendingMove = null;
            }
          }, 2000); // Add small delay to show result
        }
      );

      this.quizManager.start();
    } catch (err) {
      console.error('Unable to start quiz:', err);
      ws.send(JSON.stringify({
        type: SERVER_TO_CLIENT.INVALID_MOVE,
        message: 'Failed to fetch quiz. Move not processed.',
      }));
      this.quizMode = false;
      this.pendingMove = null;
    }
  }

  processApprovedMove(ws, cellIndex) {
    const player = this.players.find(p => p.ws === ws);
    const result = this.game.makeMove(cellIndex);

    if (!result.valid) {
      ws.send(JSON.stringify({ type: SERVER_TO_CLIENT.INVALID_MOVE, message: result.reason }));
      return;
    }

    if (result.winner) {
      this.broadcastMessage({
        type: SERVER_TO_ALL.GAME_END,
        result: 'win',
        winner: player.name,
        board: result.board,
      });
      this.resetGame();
    } else if (result.draw) {
      this.broadcastMessage({
        type: SERVER_TO_ALL.GAME_END,
        result: 'draw',
        board: result.board,
      });
      this.resetGame();
    } else {
      this.broadcastMessage({
        type: SERVER_TO_ALL.MOVE_MADE,
        board: result.board,
        currentTurn: result.nextSymbol,
      });
    }
  }

  resetGame() {
    this.gameStarted = false;
    this.game.reset();
    this.players.forEach(p => p.ready = false);

    this.broadcastMessage({
      type: SERVER_TO_ALL.READY_STATUS,
      players: this.players.map(p => ({ name: p.name, ready: p.ready, symbol: p.symbol })),
    });
  }
}

module.exports = FilettoGameServer;
