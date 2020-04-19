var express = require("express");
var router = express.Router();
var db = require("../db");
var State = require("../state");

/* GET the game if exists. */
router.get("/", (_, res) => {
  if (db.getState() === State.NO_GAME) {
    return res.json({ state: "NO_GAME" });
  }
  res.redirect("game/" + db.game.id);
});

/* POST to create a game. */
router.post("/", (req, res) => {
  if (db.getState() !== State.NO_GAME) {
    return res.status(409).send("Can't add more games");
  }

  const players = req.body.players;
  if (!players || players.length != 4 || new Set(players).size != 4) {
    return res
      .status(400)
      .send("You need to provide exactly 4 different players");
  }
  db.startGame("X", players, req.query.mock);
  return res.status(200).send({ url: "/game/X" });
});

/* GET the game. */
router.get("/:id", (req, res) => {
  if (db.getState() === State.NO_GAME || req.params.id != db.game.id) {
    return res.sendStatus(404);
  }
  const auth = getAuth(req);
  const player = auth ? auth[0] : undefined;
  if (auth && db.game.passwords[auth[0]] != auth[1]) {
    return res.sendStatus(403);
  }
  return res.json(db.game.view(player));
});

/* POST to make a move. */
router.post("/:id", (req, res) => {
  if (db.getState() === State.NO_GAME || req.params.id != db.game.id) {
    return res.sendStatus(404);
  }
  const auth = getAuth(req);
  if (!auth || db.game.passwords[auth[0]] != auth[1]) {
    return res.sendStatus(403);
  }
  const player = auth[0];
  try {
    if (req.body.move) {
      db.game.makeMove(player, req.body.move);
    } else if (req.body.nextround) {
      db.game.nextRound(player);
    } else {
      return res.status(400).send("You must provide a move or next round");
    }
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

/* DELETE the game. */
router.delete("/:id", (_, res) => {
  if (db.getState() === State.NO_GAME) {
    return res.sendStatus(404);
  }
  db.endGame();
  res.sendStatus(204);
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
