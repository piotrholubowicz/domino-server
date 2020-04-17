class Game {
  constructor(id, players, mock) {
    this.id = id;
    this.players = players; // ordered once the game starts, 0&2 vs 1&3
    this.passwords = {}; // name : password
    this.hands = mock ? mockPieces(players) : dealPieces(players); // name : list of pieces ([][])
    this.table = [][2]; // list of pieces from left to right
    this.firstPiece = []; // the first piece that was played, for table positioning
    this.currentPlayer = Object.keys(this.hands).find((player) =>
      this.hands[player].find((piece) => piece[0] == 6 && piece[1] == 6)
    );
    this.scoreLog = [][2]; // list of rounds, for each the points gained by each team
    console.log(this.hands);
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

  makeMove(player, piece, placement) {}
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
    this.State = Object.freeze({
      NO_GAME: 1,
      GAME_IN_PROGRESS: 2,
      END_OF_ROUND: 3,
    });
    this.Game = Game;
    this.state = this.State.NO_GAME;
    this.game = undefined;
  }

  startGame(id, players, mock = false) {
    this.game = new Game(id, players, mock);
    this.state = this.State.GAME_IN_PROGRESS;
  }

  endGame() {
    delete this.game;
    this.state = this.State.NO_GAME;
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
