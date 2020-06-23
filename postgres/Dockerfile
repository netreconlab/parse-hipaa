FROM postgis/postgis:latest
MAINTAINER Network Reconnaissance Lab <baker@cs.uky.edu>

RUN apt-get update && apt-get install -y --no-install-recommends\
  postgresql-$PG_MAJOR-pgaudit

#Install additional scripts. These are run in abc order during initial start
COPY ./scripts/setup-0-pgaudit.sh /docker-entrypoint-initdb.d/setup-0-pgaudit.sh
COPY ./scripts/setup-dbs.sh /docker-entrypoint-initdb.d/setup-dbs.sh
COPY ./scripts/setup-parse-index.sh /docker-entrypoint-initdb.d/setup-parse-index.sh
RUN chmod +x /docker-entrypoint-initdb.d/setup-0-pgaudit.sh /docker-entrypoint-initdb.d/setup-dbs.sh /docker-entrypoint-initdb.d/setup-parse-index

ENV POSTGRES_INITDB_ARGS "--data-checksums"

CMD ["postgres", "-c", "shared_preload_libraries=pgaudit"]
