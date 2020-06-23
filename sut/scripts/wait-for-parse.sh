#!/bin/bash

until curl --silent parse:1337/parse | grep -q 'unauthorized'; do
  >&2 echo "parse-server is unavailable - parse-sut is sleeping"
  sleep 1
done

echo "parse-server is ready, starting test..."
sleep 5
#exec "$@"
