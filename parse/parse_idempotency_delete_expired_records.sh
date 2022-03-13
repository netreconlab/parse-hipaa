#!/bin/bash

set -e
psql -v ON_ERROR_STOP=1 "$DB_URL"?sslmode=require <<-EOSQL
    SELECT idempotency_delete_expired_records();
EOSQL

exec "$@"
