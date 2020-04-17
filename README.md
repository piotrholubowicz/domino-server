# domino-server

The backend for hosting domino games.

## The API

/game

- GET /game - redirects to /game/X or 404 Not Found
- POST /game - creates a new game for the provided 4 players or 409 Conflict if already exists

- GET /game/X - returns the game; use basic HTTP authentication to get a view for a player
- POST /game/X - make a move or choose to start the next round; authentication required
- DELETE /game/X - ends the game and deletes all players; authentication required

/players

- GET /players - returns the list of players

- PUT /players/X - set a password for the player
