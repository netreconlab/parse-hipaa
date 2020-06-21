#!/bin/bash

until curl --silent parse:1337/parse | grep -q 'unauthorized'; do
  >&2 echo "parse-server is unavailable - sleeping"
  sleep 1
done

echo "parse-server is ready, starting test..."
sleep 5 #Give some time for parse-server to run CloudCode to see if it crashes server
#exec "$@"
