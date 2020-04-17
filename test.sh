#!/bin/bash

assert ()                 #  If condition false,
{                         #+ exit from script with error message.
  E_ASSERT_FAILED=99
  
  if [ ! $1 ] 
  then
    echo "Assertion failed:  \"$1\""
    exit $E_ASSERT_FAILED
  fi 
}    

JS='Content-Type: application/json'
A1='Authorization: Basic QWxwaGE6QTE='
B2='Authorization: Basic QnJhdm86QjI='
C3='Authorization: Basic Q2hhcmxpZTpDMw=='
D4='Authorization: Basic RGVsdGE6RDQ='

# assert "`curl -X GET -s -o /dev/null -w "%{http_code}" http://localhost:3000/players` -eq 200"
echo && curl -X GET http://localhost:3000/game -H "$JS"
echo && curl -X GET http://localhost:3000/players -H "$JS"
echo && curl -X POST http://localhost:3000/game?mock=1 -H "$JS" -d '{ "players": ["Alpha", "Bravo", "Charlie", "Delta"] }'
echo && curl -X GET http://localhost:3000/players -H "$JS"
echo && curl -X PUT http://localhost:3000/players/Alpha -H "$JS" -d '{ "password": "A1" }'
echo && curl -X PUT http://localhost:3000/players/Bravo -H "$JS" -d '{ "password": "B2" }'
echo && curl -X PUT http://localhost:3000/players/Charlie -H "$JS" -d '{ "password": "C3" }'
echo && curl -X PUT http://localhost:3000/players/Delta -H "$JS" -d '{ "password": "D4" }'
echo && curl -X GET -L http://localhost:3000/game -H "$JS"
echo && curl -X GET -L http://localhost:3000/game -H "$JS" -H "$B2"
echo && curl -X POST http://localhost:3000/game/X -H "$JS" -H "$B2" -d '{ "move": { "piece": [6,6], "placement": "left" } }'
echo && curl -X POST http://localhost:3000/game/X -H "$JS" -H "$C3" -d '{ "move": { "piece": [3,6], "placement": "left" } }'
echo && curl -X POST http://localhost:3000/game/X -H "$JS" -H "$D4" -d '{ "move": { "piece": [5,6], "placement": "right" } }'
echo && curl -X POST http://localhost:3000/game/X -H "$JS" -H "$A1" -d '{ "move": { "piece": [0,5], "placement": "right" } }'
echo && curl -X POST http://localhost:3000/game/X -H "$JS" -H "$B2" -d '{ "move": { "piece": [1,3], "placement": "left" } }'
echo && curl -X POST http://localhost:3000/game/X -H "$JS" -H "$C3" -d '{ "move": { "piece": [0,3], "placement": "left" } }'
echo && curl -X POST http://localhost:3000/game/X -H "$JS" -H "$C3" -d '{ "move": { "piece": [0,3], "placement": "right" } }'
echo && curl -X POST http://localhost:3000/game/X -H "$JS" -H "$D4" -d '{ "move": { "piece": [1,2], "placement": "left" } }'
echo && curl -X POST http://localhost:3000/game/X -H "$JS" -H "$A1" -d '{ "move": { "piece": [3,4], "placement": "right" } }'
echo && curl -X POST http://localhost:3000/game/X -H "$JS" -H "$B2" -d '{ "move": { "piece": [4,6], "placement": "right" } }'
echo && curl -X POST http://localhost:3000/game/X -H "$JS" -H "$C3" -d '{ "move": { "piece": [6,1], "placement": "right" } }'
echo && curl -X POST http://localhost:3000/game/X -H "$JS" -H "$D4" -d '{ "move": { "piece": [4,1], "placement": "right" } }'
echo && curl -X POST http://localhost:3000/game/X -H "$JS" -H "$A1" -d '{ "move": { "piece": [2,2], "placement": "left" } }'
echo && curl -X POST http://localhost:3000/game/X -H "$JS" -H "$B2" -d '{ "move": { "piece": [2,3], "placement": "left" } }'
echo && curl -X POST http://localhost:3000/game/X -H "$JS" -H "$C3" -d '{ "move": { "piece": [3,6], "placement": "left" } }'
echo && curl -X POST http://localhost:3000/game/X -H "$JS" -H "$C3" -d '{ "move": { "piece": [3,3], "placement": "left" } }'
echo && curl -X POST http://localhost:3000/game/X -H "$JS" -H "$D4" -d '{ "move": { "piece": [2,4], "placement": "right" } }'
echo && curl -X POST http://localhost:3000/game/X -H "$JS" -H "$A1" -d '{ "move": { "piece": [3,5], "placement": "left" } }'
echo && curl -X POST http://localhost:3000/game/X -H "$JS" -H "$B2" -d '{ "move": { "piece": [4,5], "placement": "left" } }'
echo && curl -X POST http://localhost:3000/game/X -H "$JS" -H "$C3" -d '{ "move": { "piece": [4,4], "placement": "left" } }'
echo && curl -X POST http://localhost:3000/game/X -H "$JS" -H "$D4" -d '{ "move": "pass" }'
echo && curl -X POST http://localhost:3000/game/X -H "$JS" -H "$A1" -d '{ "move": { "piece": [0,4], "placement": "left" } }'
echo && curl -X POST http://localhost:3000/game/X -H "$JS" -H "$B2" -d '{ "move": { "piece": [0,1], "placement": "left" } }'
echo && curl -X POST http://localhost:3000/game/X -H "$JS" -H "$C3" -d '{ "move": { "piece": [2,6], "placement": "right" } }'
echo && curl -X POST http://localhost:3000/game/X -H "$JS" -H "$D4" -d '{ "move": { "piece": [0,6], "placement": "right" } }'
echo && curl -X POST http://localhost:3000/game/X -H "$JS" -H "$A1" -d '{ "move": { "piece": [0,0], "placement": "right" } }'
echo && curl -X POST http://localhost:3000/game/X -H "$JS" -H "$B2" -d '{ "move": { "piece": [1,1], "placement": "left" } }'
echo && curl -X POST http://localhost:3000/game/X -H "$JS" -H "$C3" -d '{ "move": { "piece": [0,2], "placement": "right" } }'
echo && curl -X GET -L http://localhost:3000/game -H "$JS"

echo && curl -X DELETE http://localhost:3000/game/X -H "$B2"

echo '\nFinished.'
