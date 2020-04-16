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
  if (db.players.length == 4) {
    return res.status(400).send("Can't add more players");
  }
  const name = req.body.name;
  if (!name) {
    return res.status(400).send("You must provide a name");
  }
  if (db.players.includes(name)) {
    return res.status(400).send("This name already exists");
  }
  db.players.push(name);
  const uuid = uuidv4();
  db.playersByToken[uuid] = name;
  return res.json({ token: uuid });
});

module.exports = router;
