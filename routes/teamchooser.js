var express = require("express");
var router = express.Router();
var db = require("../db");

/* GET the player choosing the team. */
router.get("/", (_, res) => {
  if (db.teamChooser) {
    return res.json(db.teamChooser);
  }
  return res.status(404);
});

/* POST to ask to choose the team. */
router.post("/", (req, res) => {
  const token = req.query.token;
  const player = db.playersByToken[token];
  if (!token || !player) {
    return res.status(403);
  }
  if (db.state != db.State.CHOOSING_TEAMS) {
    return res.status(400).send("Can't change teams now");
  }
  if (db.teamChooser && db.teamChooser != player) {
    return res.status(409).json({ teamChooser: db.teamChooser });
  }

  db.teamChooser = player;
  res.json({ teamChooser: db.teamChooser });
});

module.exports = router;
