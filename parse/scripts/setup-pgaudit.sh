#!/bin/bash

set -e
psql -v ON_ERROR_STOP=1 "$DB_URL"?sslmode=require <<-EOSQL
    CREATE EXTENSION pgaudit;
    ALTER SYSTEM SET pgaudit.log_catalog = off;
    ALTER SYSTEM SET pgaudit.log = 'all, -misc';
    ALTER SYSTEM SET pgaudit.log_relation = 'on';
    ALTER SYSTEM SET pgaudit.log_parameter = 'on';
EOSQL

exec "$@"
