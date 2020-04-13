const State = Object.freeze({
  NO_GAME: 1,
  WAITING_FOR_PLAYERS: 2,
  PLAYING: 3,
});

var state = State.NO_GAME;
var players = []; // ordered once the game starts, 0&2 vs 1&3
var tokens = {}; // name : token
var hands = {}; // name : list of pieces ([][])
var table = [][2]; // list of pieces from left to right
var firstPiece = []; // the first piece that was played, for table positioning
var currentPlayer = undefined;
var scoreLog = [][2]; // list of rounds, for each the points gained by each team

module.exports = {
  state,
  players,
  tokens,
  hands,
  table,
  firstPiece,
  currentPlayer,
  scoreLog,
};
