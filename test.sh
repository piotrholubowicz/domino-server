#!/bin/bash

JS='Content-Type: application/json'
A1='Authorization: Basic QWxwaGE6QTE='
B2='Authorization: Basic QnJhdm86QjI='
C3='Authorization: Basic Q2hhcmxpZTpDMw=='
D4='Authorization: Basic RGVsdGE6RDQ='

HOST='http://localhost:3000'
# HOST='https://dominoes-backend.herokuapp.com'

echo && curl -X GET $HOST/game -H "$JS"
echo && curl -X GET $HOST/players -H "$JS"
echo && curl -X POST $HOST/game?mock=1 -H "$JS" -d '{ "players": ["Alpha", "Bravo", "Charlie", "Delta"] }'
echo && curl -X GET $HOST/players -H "$JS"
echo && curl -X PUT $HOST/players/Alpha -H "$JS" -d '{ "password": "A1" }'
echo && curl -X PUT $HOST/players/Bravo -H "$JS" -d '{ "password": "B2" }'
echo && curl -X PUT $HOST/players/Charlie -H "$JS" -d '{ "password": "C3" }'
echo && curl -X PUT $HOST/players/Delta -H "$JS" -d '{ "password": "D4" }'
echo && curl -X GET -L $HOST/game -H "$JS"
echo && curl -X GET -L $HOST/game -H "$JS" -H "$B2"
echo && curl -X POST $HOST/game/X -H "$JS" -H "$B2" -d '{ "move": { "piece": [6,6], "placement": "left" } }'
echo && curl -X POST $HOST/game/X -H "$JS" -H "$C3" -d '{ "move": { "piece": [3,6], "placement": "left" } }'
echo && curl -X POST $HOST/game/X -H "$JS" -H "$D4" -d '{ "move": { "piece": [5,6], "placement": "right" } }'
echo && curl -X POST $HOST/game/X -H "$JS" -H "$A1" -d '{ "move": { "piece": [0,5], "placement": "right" } }'
echo && curl -X POST $HOST/game/X -H "$JS" -H "$B2" -d '{ "move": { "piece": [1,3], "placement": "left" } }'
echo && curl -X POST $HOST/game/X -H "$JS" -H "$C3" -d '{ "move": { "piece": [0,3], "placement": "left" } }'
echo && curl -X POST $HOST/game/X -H "$JS" -H "$C3" -d '{ "move": { "piece": [0,3], "placement": "right" } }'
echo && curl -X POST $HOST/game/X -H "$JS" -H "$D4" -d '{ "move": { "piece": [1,2], "placement": "left" } }'
echo && curl -X POST $HOST/game/X -H "$JS" -H "$A1" -d '{ "move": { "piece": [3,4], "placement": "right" } }'
echo && curl -X POST $HOST/game/X -H "$JS" -H "$B2" -d '{ "move": { "piece": [4,6], "placement": "right" } }'
echo && curl -X POST $HOST/game/X -H "$JS" -H "$C3" -d '{ "move": { "piece": [6,1], "placement": "right" } }'
echo && curl -X POST $HOST/game/X -H "$JS" -H "$D4" -d '{ "move": { "piece": [4,1], "placement": "right" } }'
echo && curl -X POST $HOST/game/X -H "$JS" -H "$A1" -d '{ "move": { "piece": [2,2], "placement": "left" } }'
echo && curl -X POST $HOST/game/X -H "$JS" -H "$B2" -d '{ "move": { "piece": [2,3], "placement": "left" } }'
echo && curl -X POST $HOST/game/X -H "$JS" -H "$C3" -d '{ "move": { "piece": [3,6], "placement": "left" } }'
echo && curl -X POST $HOST/game/X -H "$JS" -H "$C3" -d '{ "move": { "piece": [3,3], "placement": "left" } }'
echo && curl -X POST $HOST/game/X -H "$JS" -H "$D4" -d '{ "move": { "piece": [2,4], "placement": "right" } }'
echo && curl -X POST $HOST/game/X -H "$JS" -H "$A1" -d '{ "move": { "piece": [3,5], "placement": "left" } }'
echo && curl -X POST $HOST/game/X -H "$JS" -H "$B2" -d '{ "move": { "piece": [4,5], "placement": "left" } }'
echo && curl -X POST $HOST/game/X -H "$JS" -H "$C3" -d '{ "move": { "piece": [4,4], "placement": "left" } }'
echo && curl -X POST $HOST/game/X -H "$JS" -H "$D4" -d '{ "move": "pass" }'
echo && curl -X POST $HOST/game/X -H "$JS" -H "$A1" -d '{ "move": { "piece": [0,4], "placement": "left" } }'
echo && curl -X POST $HOST/game/X -H "$JS" -H "$B2" -d '{ "move": { "piece": [0,1], "placement": "left" } }'
echo && curl -X POST $HOST/game/X -H "$JS" -H "$C3" -d '{ "move": { "piece": [2,6], "placement": "right" } }'
echo && curl -X POST $HOST/game/X -H "$JS" -H "$D4" -d '{ "move": { "piece": [0,6], "placement": "right" } }'
echo && curl -X POST $HOST/game/X -H "$JS" -H "$A1" -d '{ "move": { "piece": [0,0], "placement": "right" } }'
echo && curl -X POST $HOST/game/X -H "$JS" -H "$B2" -d '{ "move": { "piece": [1,1], "placement": "left" } }'
echo && curl -X POST $HOST/game/X -H "$JS" -H "$C3" -d '{ "move": { "piece": [0,2], "placement": "right" } }'
echo && curl -X GET -L $HOST/game -H "$JS"
echo && curl -X POST $HOST/game/X -H "$JS" -H "$A1" -d '{ "nextround": true }'
echo && curl -X GET -L $HOST/game -H "$JS"

echo && curl -X DELETE $HOST/players/Alpha
echo && curl -X DELETE $HOST/game/X

echo '\nFinished.'
