var express = require("express");
var router = express.Router();
var db = require("../db");

/* GET players listing. */
router.get("/", (_, res) => {
  res.json(db.players);
});

module.exports = router;
