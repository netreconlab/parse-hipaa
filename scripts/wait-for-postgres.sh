#!/bin/sh
# wait-for-postgres.sh

set -eo pipefail

host="$1"
shift
cmd="$@"
timeout=60
start_time=$(date +%s)

until PGPASSWORD=$POSTGRES_PASSWORD psql -h "$host" -U "$POSTGRES_USER" -c '\q'; do
  >&2 echo "Postgres is unavailable on ${host} - parse-server is sleeping"
  sleep 1

  current_time=$(date +%s)
  elapsed_time=$((current_time - start_time))

  if [ "$elapsed_time" -gt "$timeout" ]; then
    >&2 echo "Timed out while waiting for Postgres to become available on ${host}"
    exit 1
  fi
done

>&2 echo "Postgres is up - executing command: $cmd"
exec $cmd
