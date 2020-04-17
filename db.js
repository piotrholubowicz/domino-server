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
    this.scoreLog = []; // list of rounds, for each the points gained by each team
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
      state: Object.keys(State).find((name) => State[name] === this.state),
      players: this.players,
      hands: handsView,
      table: this.table,
      firstPiece: this.firstPiece,
      currentPlayer: this.currentPlayer,
      scoreLog: this.scoreLog,
    };
  }

  makeMove(player, move) {
    if (this.state !== State.GAME_IN_PROGRESS) {
      throw "Round ended";
    }
    if (player !== this.currentPlayer) {
      throw "Not your turn";
    }
    if (move === "pass") {
      // validate?
      this.currentPlayer = this.incrementPlayer(this.currentPlayer);
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
    if (this.table.length == 0 && !pieceEquals.call(piece, [6, 6])) {
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
      this.currentPlayer = this.incrementPlayer(this.currentPlayer);
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
      this.scoreLog.push(this.roundFinished());
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
      this.addScore(this.roundBlocked());
      return true;
    }
    return false;
  }

  roundFinished() {
    this.state = State.ROUND_FINISHED;
    const idx = this.currentPlayerIdx();
    var score = 0;
    for (var i of [(idx + 1) % 4, (idx + 3) % 4]) {
      score += this.hands[this.players[i]].reduce(
        (sum, piece) => sum + piece[0] + piece[1],
        0
      );
    }
    return idx % 2 == 0 ? [score, 0] : [0, score];
  }

  roundBlocked() {
    this.state = State.ROUND_BLOCKED;
    var points = [0, 0];
    for (const [i, player] of this.players.entries()) {
      points[i % 2] += this.hands[player].reduce(
        (sum, piece) => sum + piece[0] + piece[1],
        0
      );
    }
    if (points[0] < points[1]) {
      return [points[1], 0];
    }
    if (points[0] > points[1]) {
      return [0, points[0]];
    }
    return [0, 0];
  }

  addScore(score) {
    const idx = this.currentPlayerIdx();
    if (idx === 0 || idx === 2) {
      this.scoreLog.push([score, 0]);
    } else {
      this.scoreLog.push([0, score]);
    }
  }

  currentPlayerIdx() {
    return this.players.indexOf(this.currentPlayer);
  }

  nextRound(player) {
    if (this.state == State.GAME_IN_PROGRESS) {
      throw "This round is still in progress";
    }
    this.table = [];
    this.hands = dealPieces(this.players);
    this.startingPlayer = this.incrementPlayer(this.startingPlayer);
    this.currentPlayer = this.startingPlayer;
    this.state = State.GAME_IN_PROGRESS;
  }

  incrementPlayer(player, increment = 1) {
    return this.players[(this.players.indexOf(player) + increment) % 4];
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
