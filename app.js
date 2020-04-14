var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var playersRouter = require("./routes/players");
var teamChooserRouter = require("./routes/teamchooser");
var teamsRouter = require("./routes/teams");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/players", playersRouter);
app.use("/teamchooser", teamChooserRouter);
app.use("/teams", teamsRouter);

module.exports = app;
