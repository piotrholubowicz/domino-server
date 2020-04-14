const State = Object.freeze({
  NO_GAME: 1,
  WAITING_FOR_PLAYERS: 2,
  CHOOSING_TEAMS: 3,
  PLAYING: 4,
});

var state = State.NO_GAME;
var teamChooser = undefined; // player selecting the teams
var players = []; // ordered once the game starts, 0&2 vs 1&3
var playersByToken = {}; // token : name
var hands = {}; // name : list of pieces ([][])
var table = [][2]; // list of pieces from left to right
var firstPiece = []; // the first piece that was played, for table positioning
var currentPlayer = undefined;
var scoreLog = [][2]; // list of rounds, for each the points gained by each team

/* Assumes players are available. */
function dealPieces() {
  if (!players || players.length != 4) {
    throw "Players need to be provided";
  }
  var pieces = [][2];
  for (var i = 0; i < 7; i++) {
    for (var j = i; j < 7; j++) {
      pieces.push([i, j]);
    }
  }
  shuffle(pieces);
  for (var player of players) {
    hands[player] = pieces.splice(0, 7);
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

module.exports = {
  State,
  state,
  teamChooser,
  players,
  playersByToken,
  hands,
  table,
  firstPiece,
  currentPlayer,
  scoreLog,
  dealPieces,
};
