var express = require("express");
var router = express.Router();
var db = require("../db");

/* GET the game if exists. */
router.get("/", (_, res) => {
  if (db.state == db.State.NO_GAME) {
    return res.sendStatus(404);
  }
  res.redirect("/" + db.id);
});

/* POST to create a game. */
router.post("/", (req, res) => {
  if (db.state != db.State.NO_GAME) {
    return res.status(409).send("Can't add more games");
  }

  const players = req.body.players;
  if (!players || players.length != 4 || new Set(players).size != 4) {
    return res.status(400).send("Malformed property: players");
  }
  db.players = players;
  db.id = "X";
  db.dealPieces();
  db.currentPlayer = Object.keys(db.hands).find((player) =>
    db.hands[player].includes([6, 6])
  );
  db.state = db.State.GAME_IN_PROGRESS;
  return res.sendStatus(200);
});

/* GET the game. */
router.get("/:id", (req, res) => {
  if (db.state == db.State.NO_GAME || req.params.id != db.id) {
    return res.sendStatus(404);
  }
  const auth = getAuth(req);
  const player = auth ? auth[0] : undefined;
  if (db.passwords[auth[0]] != auth[1]) {
    return res.sendStatus(403);
  }
  var hands = {};
  for (var p in db.hands) {
    hands[player] = p == player ? db.hands[p] : db.hands[p].length;
  }
  return res.json({
    id: db.id,
    players: db.players,
    hands,
    table: db.table,
    firstPiece: db.firstPiece,
    currentPlayer: db.currentPlayer,
    scoreLog: db.scoreLog,
  });
});

module.exports = router;

function getAuth(req) {
  const authorization = req.get("Authorization");
  if (!authorization || !authorization.startsWith("Basic ")) {
    return;
  }
  const buffer = new Buffer(authorization.substring("Basic ".length), "base64");
  const parts = buffer.toString("ascii").split(":");
  if (parts.length != 2) {
    return;
  }
  return parts;
}
