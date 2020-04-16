var express = require("express");
var router = express.Router();
var db = require("../db");

/* GET the player choosing the team. */
router.get("/", (_, res) => {
  if (db.teamChooser) {
    return res.json(db.teamChooser);
  }
  return res.sendStatus(404);
});

/* POST to ask to choose the team. */
router.post("/", (req, res) => {
  const token = req.query.token;
  const player = db.playersByToken[token];
  if (!token || !player) {
    return res.sendStatus(403);
  }
  if (db.state != db.State.WAITING_FOR_PLAYERS) {
    return res.status(400).send("Can't change teams now");
  }
  if (db.players.length < 4) {
    return res.status(400).send("Too few players");
  }
  if (db.teamChooser && db.teamChooser != player) {
    return res.status(409).json({ teamChooser: db.teamChooser });
  }

  db.teamChooser = player;
  db.state = db.State.WAITING_FOR_PLAYERS;
  res.json({ teamChooser: db.teamChooser });
});

module.exports = router;
