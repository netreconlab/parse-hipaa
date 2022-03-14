#!/bin/sh
# wait-for-postgres.sh

set -e

cmd="$@"

until psql "$DB_URL"?sslmode=require -c '\q'; do
  >&2 echo "Postgres is unavailable - parse-hipaa is sleeping"
  sleep 1
done

>&2 echo "Postgres is up - executing command"
exec $cmd
