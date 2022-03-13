#!/bin/bash

set -e
psql -v ON_ERROR_STOP=1 "$DB_URL"?sslmode=require <<-EOSQL
    CREATE EXTENSION postgis;
    CREATE EXTENSION postgis_topology;
EOSQL

exec "$@"
