var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

var indexRouter = require("./routes/index");
var gameRouter = require("./routes/game");
var playersRouter = require("./routes/players");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const corsOptions = {
  exposedHeaders: [
    "Cache-Control",
    "Content-Language",
    "Content-Length",
    "Content-Type",
    "Expires",
    "Last-Modified",
    "Pragma",
    "Etag",
  ],
};
app.use(cors(corsOptions));

app.use("/game", gameRouter);
app.use("/players", playersRouter);
app.use("/", indexRouter);

module.exports = app;
