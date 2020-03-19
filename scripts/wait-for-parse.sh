#!/bin/bash

until curl --silent parse:1337/parse | grep -q 'unauthorized'; do
  >&2 echo "Parse is unavailable - sleeping"
  sleep 1
done

echo "ParseServer is ready, starting test..."

#exec "$@"
