const FilettoGame = require('@shared/filettoGame');
const BaseGameRoom = require('./baseGameRoom');
const {
  CLIENT_TO_SERVER,
  SERVER_TO_CLIENT,
  SERVER_TO_ALL,
} = require('@shared/messages');

const QuizManager = require('./quizManager');
const { fetchQuiz } = require('./quizProvider');

class FilettoGameRoom extends BaseGameRoom {
  constructor(options) {
    super(options);
    this.game = new FilettoGame();
    this.quizManager = null;
    this.quizMode = false;
    this.pendingMove = null;
  }

  getMaxPlayers() {
    return 2;
  }

  createPlayer(ws, name, id) {
    const symbol = this.players.length === 0 ? 'X' : 'O';
    return { ws, name, id, ready: false, symbol };
  }

  handleMessage(ws, data) {
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
          this.quizManager.handleAnswer(ws, data.selectedIndex);
        }
        break;
      case CLIENT_TO_SERVER.START_GAME:
        if (this.isOwner(ws)) {
          this.startGame();
        }
        break;
      default:
        console.warn('Unknown message type:', data.type);
    }
  }

  handleReady(ws) {
    const player = this.players.find(p => p.ws === ws);
    if (!player) return;

    player.ready = true;
    this.broadcastPlayerStatus();

    //if we have no owner, 
    // we start the game when reaching the max number of players only if all players are ready
    if (!this.owner) {
      if (this.players.length === this.getMaxPlayers() && this.players.every(p => p.ready)) {
        this.startGame();
      }
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
      playersData: this.players.map(p => ({
        id: p.id,
        name: p.name,
        symbol: p.symbol,
      }))
    });
  }

  handleMove(ws, cellIndex) {
    if (!this.gameStarted || this.quizMode) return;

    const player = this.players.find(p => p.ws === ws);
    if (!player || player.symbol !== this.game.getCurrentSymbol()) {
      ws.send(JSON.stringify({ type: SERVER_TO_CLIENT.INVALID_MOVE, message: 'Not your turn' }));
      return;
    }

    this.pendingMove = { ws, cellIndex };
    this.startQuiz(ws);
  }

  async startQuiz(ws) {
    this.quizMode = true;

    try {
      const params = {
        numQuestions: 1,
        type: 'multiple',
        difficulty: 'hard',
        category: 12,
      };
      const question = await fetchQuiz(params);

      this.quizManager = new QuizManager(
        this.getAllSockets(),
        question,
        ws,
        10,
        (passed) => {
          this.quizMode = false;

          setTimeout(() => {
            if (passed) {
              const { ws: moveWs, cellIndex } = this.pendingMove;
              this.pendingMove = null;
              this.processApprovedMove(moveWs, cellIndex);
            } else {
              const currentSymbol = this.game.getCurrentSymbol();
              const nextSymbol = currentSymbol === 'X' ? 'O' : 'X';
              this.game.currentSymbol = nextSymbol;

              this.broadcastMessage({
                type: SERVER_TO_ALL.MOVE_MADE,
                board: this.game.getBoard(),
                currentTurn: nextSymbol,
              });

              this.pendingMove.ws.send(JSON.stringify({
                type: SERVER_TO_CLIENT.INVALID_MOVE,
                message: 'Quiz failed. Move not allowed.',
              }));

              this.pendingMove = null;
            }
          }, 2000);
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
    this.quizMode = false;
    this.quizManager = null;
    this.pendingMove = null;
    this.players.forEach(p => p.ready = false);
    this.broadcastPlayerStatus();
  }

  forceEndGame() {
    this.broadcastMessage({
      type: SERVER_TO_ALL.GAME_END,
      result: 'draw',
      board: this.game.getBoard(),
    });
    this.resetGame();
  }
}

module.exports = FilettoGameRoom;
