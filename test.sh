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

# assert "`curl -X GET -s -o /dev/null -w "%{http_code}" http://localhost:3000/players` -eq 200"
echo && curl -X GET http://localhost:3000/game -H 'Content-Type: application/json'
echo && curl -X GET http://localhost:3000/players -H 'Content-Type: application/json'
echo && curl -X POST http://localhost:3000/game?mock=1 -H 'Content-Type: application/json' -d '{ "players": ["Alpha", "Bravo", "Charlie", "Delta"] }'
echo && curl -X GET http://localhost:3000/players -H 'Content-Type: application/json'
echo && curl -X PUT http://localhost:3000/players/Alpha -H 'Content-Type: application/json' -d '{ "password": "A1" }'
echo && curl -X PUT http://localhost:3000/players/Bravo -H 'Content-Type: application/json' -d '{ "password": "B2" }'
echo && curl -X PUT http://localhost:3000/players/Charlie -H 'Content-Type: application/json' -d '{ "password": "C3" }'
echo && curl -X PUT http://localhost:3000/players/Delta -H 'Content-Type: application/json' -d '{ "password": "D4" }'
echo && curl -X GET -L http://localhost:3000/game -H 'Content-Type: application/json'
echo && curl -X GET -L http://localhost:3000/game -H 'Content-Type: application/json' -H 'Authorization: Basic QnJhdm86QjI='

echo && curl -X DELETE http://localhost:3000/game/X -H 'Authorization: Basic QnJhdm86QjI='

echo '\nFinished.'
