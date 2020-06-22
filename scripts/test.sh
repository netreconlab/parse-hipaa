#!/bin/bash

if curl --silent -X POST \
-H "X-Parse-Application-Id: E036A0C5-6829-4B40-9B3B-3E05F6DF32B2" \
-H "Content-Type: application/json" \
-d '{"uuid":"12345","entityId":"54321","source":"test"}' \
parse:1337/parse/classes/Patient | grep -q 'objectId'; then
echo "Tests passed!"
  exit 0
else
  echo "Tests failed!"
  exit 1
fi

exec "$@"
