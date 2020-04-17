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
B2='Authorization: Basic QnJhdm86QjI='

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
echo && curl -X GET -L http://localhost:3000/game -H "$JS"  -H "$B2"

echo && curl -X DELETE http://localhost:3000/game/X -H "$B2"

echo '\nFinished.'
