var express = require("express");
var router = express.Router();
var db = require("../db");

/* GET the game if exists. */
router.get("/", (_, res) => {
  if (db.state == db.State.NO_GAME) {
    return res.sendStatus(404);
  }
  res.redirect("/" + db.game.id);
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
  db.startGame("X", players);
  return res.sendStatus(200);
});

/* GET the game. */
router.get("/:id", (req, res) => {
  if (db.state == db.State.NO_GAME || req.params.id != db.game.id) {
    return res.sendStatus(404);
  }
  const auth = getAuth(req);
  const player = auth ? auth[0] : undefined;
  if (db.game.passwords[auth[0]] != auth[1]) {
    return res.sendStatus(403);
  }
  return res.json(db.game.view(player));
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
