#!/bin/bash

if curl --silent -X POST \
-H "X-Parse-Application-Id: E036A0C5-6829-4B40-9B3B-3E05F6DF32B2" \
-H "Content-Type: application/json" \
-d '{"score":1337,"playerName":"Sean Plott","cheatMode":false}' \
parse:1337/parse/classes/GameScore | grep -q 'objectId'; then
echo "Tests passed!"
  exit 0
else
  echo "Tests failed!"
  exit 1
fi
