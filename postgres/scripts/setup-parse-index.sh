#!/bin/bash

set -e

psql -v ON_ERROR_STOP=1 --username "${POSTGRES_USER}" --dbname "${POSTGRES_DB}" <<-EOSQL
    \c ${PG_PARSE_DB};
    CREATE INDEX IF NOT EXISTS Patient_deletedDate_is_null ON "Patient" (("deletedDate" IS NULL)) WHERE ("deletedDate" IS NULL);
    CREATE INDEX IF NOT EXISTS Patient_next_is_null ON "Patient" ((next IS NULL)) WHERE (next IS NULL);
    CREATE INDEX IF NOT EXISTS CarePlan_deletedDate_is_null ON "CarePlan" (("deletedDate" IS NULL)) WHERE ("deletedDate" IS NULL);
    CREATE INDEX IF NOT EXISTS CarePlan_next_is_null ON "CarePlan" ((next IS NULL)) WHERE (next IS NULL);
    CREATE INDEX IF NOT EXISTS Contact_deletedDate_is_null ON "Contact" (("deletedDate" IS NULL)) WHERE ("deletedDate" IS NULL);
    CREATE INDEX IF NOT EXISTS Contact_next_is_null ON "Contact" ((next IS NULL)) WHERE (next IS NULL);
    CREATE INDEX IF NOT EXISTS Task_deletedDate_is_null ON "Task" (("deletedDate" IS NULL)) WHERE ("deletedDate" IS NULL);
    CREATE INDEX IF NOT EXISTS Task_next_is_null ON "Task" ((next IS NULL)) WHERE (next IS NULL);
    CREATE INDEX IF NOT EXISTS Outcome_deletedDate_is_null ON "Outcome" (("deletedDate" IS NULL)) WHERE ("deletedDate" IS NULL);
EOSQL

exec "$@"
