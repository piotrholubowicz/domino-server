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

assert "`curl -X GET -s -o /dev/null -w "%{http_code}" http://localhost:3000/players` -eq 200"
curl -POST http://localhost:3000/players -H 'Content-Type: application/json' -d '{ "name": "aa" }'
assert "`curl -POST -s -o /dev/null -w "%{http_code}" http://localhost:3000/players -H 'Content-Type: application/json' -d '{ "name": "aa" }'` -eq 400"
curl -POST http://localhost:3000/players -H 'Content-Type: application/json' -d '{ "name": "bb" }'
curl -POST http://localhost:3000/players -H 'Content-Type: application/json' -d '{ "name": "cc" }'
curl -POST http://localhost:3000/players -H 'Content-Type: application/json' -d '{ "name": "dd" }'
assert "`curl -X POST -s -o /dev/null -w "%{http_code}" http://localhost:3000/teamchooser` -eq 403"

echo '\nFinished.\n'