#!/bin/bash

set -e

psql -v ON_ERROR_STOP=1 --username "${POSTGRES_USER}" --dbname "${POSTGRES_DB}" <<-EOSQL
    \c ${PG_PARSE_DB};
    CREATE INDEX IF NOT EXISTS "Patient_deletedDate_is_null" ON "Patient" (("deletedDate" IS NULL)) WHERE ("deletedDate" IS NULL);
    CREATE INDEX IF NOT EXISTS "Patient_previousVersionUUIDs_array" ON "Patient" USING GIN ("previousVersionUUIDs");
    CREATE INDEX IF NOT EXISTS "Patient_nextVersionUUIDs_array" ON "Patient" USING GIN ("nextVersionUUIDs");
    CREATE INDEX IF NOT EXISTS "CarePlan_deletedDate_is_null" ON "CarePlan" (("deletedDate" IS NULL)) WHERE ("deletedDate" IS NULL);
    CREATE INDEX IF NOT EXISTS "CarePlan_previousVersionUUIDs_array" ON "CarePlan" USING GIN ("previousVersionUUIDs");
    CREATE INDEX IF NOT EXISTS "CarePlan_nextVersionUUIDs_array" ON "CarePlan" USING GIN ("nextVersionUUIDs");
    CREATE INDEX IF NOT EXISTS "Contact_deletedDate_is_null" ON "Contact" (("deletedDate" IS NULL)) WHERE ("deletedDate" IS NULL);
    CREATE INDEX IF NOT EXISTS "Contact_previousVersionUUIDs_array" ON "Contact" USING GIN ("previousVersionUUIDs");
    CREATE INDEX IF NOT EXISTS "Contact_nextVersionUUIDs_array" ON "Contact" USING GIN ("nextVersionUUIDs");
    CREATE INDEX IF NOT EXISTS "Task_deletedDate_is_null" ON "Task" (("deletedDate" IS NULL)) WHERE ("deletedDate" IS NULL);
    CREATE INDEX IF NOT EXISTS "Task_previousVersionUUIDs_array" ON "Task" USING GIN ("previousVersionUUIDs");
    CREATE INDEX IF NOT EXISTS "Task_nextVersionUUIDs_array" ON "Task" USING GIN ("nextVersionUUIDs");
    CREATE INDEX IF NOT EXISTS "HealthKitTask_deletedDate_is_null" ON "HealthKitTask" (("deletedDate" IS NULL)) WHERE ("deletedDate" IS NULL);
    CREATE INDEX IF NOT EXISTS "HealthKitTask_previousVersionUUIDs_array" ON "HealthKitTask" USING GIN ("previousVersionUUIDs");
    CREATE INDEX IF NOT EXISTS "HealthKitTask_nextVersionUUIDs_array" ON "HealthKitTask" USING GIN ("nextVersionUUIDs");
    CREATE INDEX IF NOT EXISTS "Outcome_deletedDate_is_null" ON "Outcome" (("deletedDate" IS NULL)) WHERE ("deletedDate" IS NULL);
    CREATE INDEX IF NOT EXISTS "Outcome_previousVersionUUIDs_array" ON "Outcome" USING GIN ("previousVersionUUIDs");
    CREATE INDEX IF NOT EXISTS "Outcome_nextVersionUUIDs_array" ON "Outcome" USING GIN ("nextVersionUUIDs");
EOSQL

exec "$@"
