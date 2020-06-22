#!/bin/bash

cat >> ${PGDATA}/postgresql.conf <<EOF
log_destination = 'csvlog'
logging_collector = on
log_connections = on
EOF

set -e
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE EXTENSION pgaudit;
    ALTER SYSTEM SET pgaudit.log_catalog = off;
    ALTER SYSTEM SET pgaudit.log = 'all, -misc';
    ALTER SYSTEM SET pgaudit.log_relation = 'on';
    ALTER SYSTEM SET pgaudit.log_parameter = 'on';
EOSQL

exec "$@"
