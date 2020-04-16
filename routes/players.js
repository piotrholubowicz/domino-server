var express = require("express");
var router = express.Router();
var db = require("../db");

/* GET players listing. */
router.get("/", (_, res) => {
  return db.state == db.State.NO_GAME
    ? res.sendStatus(404)
    : res.json(db.game.players);
});

/* PUT to change the password. Allowed only once. */
router.post("/:id", (req, res) => {
  const player = req.params.id;
  if (db.state == db.State.NO_GAME || !db.game.players.includes(player)) {
    return res.sendStatus(404);
  }
  if (db.game.passwords[player]) {
    return res.status(409).send("Password already exists");
  }
  const password = req.body.password;
  if (!password) {
    return res.status(400).send("You must provide a password");
  }
  db.game.passwords[player] = password;
  return res.sendStatus(200);
});

module.exports = router;
