var express = require("express");
var router = express.Router();
var db = require("../db");
var State = require("../state");

/* GET players listing. */
router.get("/", (_, res) => {
  return db.getState() === State.NO_GAME
    ? res.sendStatus(404)
    : res.json(db.game.players);
});

/* PUT to change the password. Allowed only once. */
router.put("/:id", (req, res) => {
  const player = req.params.id;
  if (db.getState() === State.NO_GAME || !db.game.players.includes(player)) {
    return res.sendStatus(404);
  }
  const password = req.body.password;
  if (!password) {
    return res.status(400).send("You must provide a password");
  }
  if (db.game.passwords[player]) {
    if (db.game.passwords[player] === password) {
      // Confirms the password is ok
      return res.sendStatus(204);
    }
    return res.status(409).send("This player has already been claimed");
  }
  db.game.passwords[player] = password;
  return res.sendStatus(204);
});

/* DELETE to reset the player. */
router.delete("/:id", (_, res) => {
  const player = req.params.id;
  if (db.getState() === State.NO_GAME || !db.game.players.includes(player)) {
    return res.sendStatus(404);
  }
  db.game.passwords[player] = undefined;
  res.sendStatus(204);
});

module.exports = router;
