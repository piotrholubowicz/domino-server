const { v4: uuidv4 } = require("uuid");

var express = require("express");
var router = express.Router();
var db = require("../db");

/* GET players listing. */
router.get("/", (_, res) => {
  res.json(db.players);
});

/* POST a new player. */
router.post("/", (req, res) => {
  if (db.state == db.State.PLAYING || db.state == db.State.CHOOSING_TEAMS) {
    return res.status(400).send("Can't add players during a game");
  }
  const name = req.body.name;
  if (!name) {
    return res.status(400).send("You must provide a name");
  }
  db.players.push(name);
  if (db.players.length == 4) {
    db.state = db.State.CHOOSING_TEAMS;
  }
  const uuid = uuidv4();
  db.tokens[uuid] = name;
  return res.json({ token: uuid });
});

module.exports = router;
