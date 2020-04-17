var State = require("./state");

class Game {
  constructor(id, players, mock) {
    this.id = id;
    this.state = State.GAME_IN_PROGRESS;
    this.players = players; // ordered once the game starts, 0&2 vs 1&3
    this.passwords = {}; // name : password
    this.hands = mock ? mockPieces(players) : dealPieces(players); // name : list of pieces ([][])
    this.table = []; // list of pieces from left to right
    this.firstPiece = []; // the first piece that was played, for table positioning
    this.currentPlayer = Object.keys(this.hands).find((player) =>
      this.hands[player].find(pieceEquals, [6, 6])
    );
    this.startingPlayer = this.currentPlayer;
    this.endingPlayer = undefined; //
    this.scoreLog = []; // list of rounds, for each the points gained by each team
    console.log(this.hands);
  }

  getState() {
    return this.state;
  }

  view(player) {
    var handsView = {};
    for (var p in this.hands) {
      handsView[p] = p == player ? this.hands[p] : this.hands[p].length;
    }
    return {
      id: this.id,
      players: this.players,
      hands: handsView,
      table: this.table,
      firstPiece: this.firstPiece,
      currentPlayer: this.currentPlayer,
      scoreLog: this.scoreLog,
    };
  }

  makeMove(player, move) {
    if (player !== this.currentPlayer) {
      throw "Not your turn";
    }
    if (move === "pass") {
      // validate?
      this.advancePlayer();
      return;
    }
    if (
      !move.piece ||
      move.piece.length != 2 ||
      !move.placement ||
      !["left", "right"].includes(move.placement)
    ) {
      throw "You must provide a piece and a placement";
    }
    const piece = move.piece;
    const placement = move.placement;
    if (this.scoreLog.length == 0 && !pieceEquals.call(piece, [6, 6])) {
      throw `The game must start with [6,6]`;
    }
    const pieceIdx = this.hands[player].findIndex(pieceEquals, piece);
    if (pieceIdx === -1) {
      throw `You don't have a piece ${piece}`;
    }
    if (this.table.length == 0) {
      this.table.push(piece);
      this.firstPiece = piece;
    } else {
      if (placement === "left") {
        this.playLeft(piece);
      } else if (placement === "right") {
        this.playRight(piece);
      }
    }
    this.hands[player].splice(pieceIdx, 1);
    if (!this.endOfRound()) {
      this.advancePlayer();
    }
  }

  playLeft(piece) {
    const endPiece = this.table[0];
    if (piece[1] === endPiece[0]) {
      // all good
    } else if (piece[0] === endPiece[0]) {
      piece.reverse();
    } else {
      throw `Piece ${piece} does not match ${endPiece}`;
    }
    this.table.unshift(piece);
  }

  playRight(piece) {
    const endPiece = this.table[this.table.length - 1];
    if (piece[0] === endPiece[1]) {
      // all good
    } else if (piece[1] === endPiece[1]) {
      piece.reverse();
    } else {
      throw `Piece ${piece} does not match ${endPiece}`;
    }
    this.table.push(piece);
  }

  endOfRound() {
    if (this.hands[this.currentPlayer].length === 0) {
      this.roundFinished();
      return true;
    }
    if (
      this.table.length > 6 &&
      this.table[0][0] === this.table[this.table.length - 1][1] &&
      this.table.filter(
        (piece) =>
          piece[0] === this.table[0][0] || piece[1] === this.table[0][0]
      ).length === 7
    ) {
      this.roundBlocked();
      return true;
    }
    return false;
  }

  roundFinished() {
    this.state = State.ROUND_FINISHED;
    // TODO calculate score
  }

  roundBlocked() {
    this.state = State.ROUND_BLOCKED;
    // TODO calculate score
  }

  advancePlayer() {
    const playerIdx = this.players.indexOf(this.currentPlayer);
    this.currentPlayer = this.players[(playerIdx + 1) % 4];
  }
}

function pieceEquals(piece) {
  return (
    (this[0] === piece[0] && this[1] === piece[1]) ||
    (this[1] === piece[0] && this[0] === piece[1])
  );
}

function dealPieces(players) {
  if (!players || players.length != 4) {
    throw "Players need to be provided";
  }
  var pieces = [];
  for (var i = 0; i < 7; i++) {
    for (var j = i; j < 7; j++) {
      pieces.push([i, j]);
    }
  }
  shuffle(pieces);
  var hands = {};
  for (var player of players) {
    hands[player] = pieces.splice(0, 7);
  }
  return hands;
}

function mockPieces(players) {
  return {
    [players[0]]: [
      [0, 5],
      [2, 2],
      [3, 4],
      [2, 5],
      [0, 4],
      [0, 0],
      [3, 5],
    ],
    [players[1]]: [
      [4, 6],
      [1, 3],
      [6, 6],
      [4, 5],
      [1, 1],
      [0, 1],
      [2, 3],
    ],
    [players[2]]: [
      [3, 3],
      [3, 6],
      [0, 3],
      [0, 2],
      [1, 6],
      [4, 4],
      [2, 6],
    ],
    [players[3]]: [
      [0, 6],
      [2, 4],
      [1, 4],
      [1, 5],
      [5, 5],
      [1, 2],
      [5, 6],
    ],
  };
}

class GameState {
  constructor() {
    this.Game = Game;
    this.game = undefined;
  }

  getState() {
    if (!this.game) {
      return State.NO_GAME;
    }
    return this.game.getState();
  }

  startGame(id, players, mock = false) {
    this.game = new Game(id, players, mock);
    this.state = State.GAME_IN_PROGRESS;
  }

  endGame() {
    delete this.game;
  }
}

function shuffle(a) {
  for (let i = a.length; i; i--) {
    const j = Math.floor(Math.random() * i);
    const x = a[i - 1];
    a[i - 1] = a[j];
    a[j] = x;
  }
  return a;
}

module.exports = exports = new GameState();
