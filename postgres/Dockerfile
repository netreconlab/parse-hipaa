FROM postgres:13
MAINTAINER Network Reconnaissance Lab <baker@cs.uky.edu>

ENV POSTGIS_MAJOR 3
ENV POSTGIS_VERSION 3.1.3+dfsg-1~exp1.pgdg100+1

RUN apt-get update \
      && apt-cache showpkg postgresql-$PG_MAJOR-postgis-$POSTGIS_MAJOR \
      && apt-get install -y --no-install-recommends \
           postgresql-$PG_MAJOR-postgis-$POSTGIS_MAJOR=$POSTGIS_VERSION \
           postgresql-$PG_MAJOR-postgis-$POSTGIS_MAJOR-scripts \
      && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /docker-entrypoint-initdb.d
COPY ./scripts/initdb-postgis.sh /docker-entrypoint-initdb.d/10_postgis.sh
COPY ./scripts/update-postgis.sh /usr/local/bin

#Install additional scripts. These are run in abc order during initial start
COPY ./scripts/setup-0-pgaudit.sh /docker-entrypoint-initdb.d/setup-0-pgaudit.sh
COPY ./scripts/setup-dbs.sh /docker-entrypoint-initdb.d/setup-dbs.sh
RUN chmod +x /docker-entrypoint-initdb.d/setup-0-pgaudit.sh /docker-entrypoint-initdb.d/setup-dbs.sh

#Install script for ParseCareKit to be run after first run
RUN mkdir parseScripts
COPY ./scripts/setup-parse-index.sh ./parseScripts/setup-parse-index.sh
RUN chmod +x ./parseScripts/setup-parse-index.sh

ENV POSTGRES_INITDB_ARGS "--data-checksums"

CMD ["postgres", "-c", "shared_preload_libraries=pgaudit"]
