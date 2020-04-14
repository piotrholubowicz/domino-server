var express = require("express");
var router = express.Router();
var db = require("../db");

/* GET the ordered players list. */
router.get("/", (_, res) => {
  if (db.state != db.State.PLAYING) {
    return res.status(404);
  }
  res.json(db.players);
});

/* POST an ordered list of players. */
router.post("/", (req, res) => {
  const token = req.query.token;
  const player = db.playersByToken[token];
  if (!token || !player) {
    return res.status(403);
  }
  if (db.state != db.State.CHOOSING_TEAMS) {
    return res.status(400).send("Can't define teams now");
  }
  if (!db.teamChooser || db.teamChooser != player) {
    return res.status(403);
  }
  const teams = req.body.players;
  if (new Set(teams) != new Set(db.players)) {
    return res.status(400).send("The teams do not match the players");
  }
  db.players = [...teams];
  db.dealPieces();
  db.currentPlayer = Object.keys(db.hands).find((player) =>
    db.hands[player].includes([6, 6])
  );
  db.state = db.State.PLAYING;
  return res.status(200);
});

module.exports = router;
