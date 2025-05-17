// @src/filettoGame.js

class FilettoGame {
  constructor() {
    this.reset();
  }

  reset() {
    this.board = Array(9).fill(null);
    this.currentSymbol = 'X'; // X always starts
  }

  getBoard() {
    return this.board.slice(); // copy
  }

  getCurrentSymbol() {
    return this.currentSymbol;
  }

  makeMove(index) {
    if (this.board[index] !== null) {
      return { valid: false, reason: 'Cell occupied' };
    }

    this.board[index] = this.currentSymbol;
    const winner = this.checkWinner();
    const isDraw = this.board.every(cell => cell !== null);

    const moveResult = {
      valid: true,
      board: this.getBoard(),
      currentSymbol: this.currentSymbol,
      nextSymbol: winner || isDraw ? null : (this.currentSymbol === 'X' ? 'O' : 'X'),
      winner,
      draw: !winner && isDraw,
    };

    if (!winner && !isDraw) {
      this.currentSymbol = this.currentSymbol === 'X' ? 'O' : 'X';
    }

    return moveResult;
  }

  checkWinner() {
    const b = this.board;
    const wins = [
      [0,1,2], [3,4,5], [6,7,8],
      [0,3,6], [1,4,7], [2,5,8],
      [0,4,8], [2,4,6],
    ];
    for (const [a, bIdx, c] of wins) {
      if (b[a] && b[a] === b[bIdx] && b[a] === b[c]) {
        return b[a]; // 'X' or 'O'
      }
    }
    return null;
  }
}

module.exports = FilettoGame;
