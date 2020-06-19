FROM postgis/postgis:12-3.0
MAINTAINER Network Reconnaissance Lab <baker@cs.uky.edu>

ENV POSTGRES_PASSWORD ${POSTGRES_PASSWORD}
ENV PG_PARSE_USER ${PG_PARSE_USER}
ENV PG_PARSE_PASSWORD ${PG_PARSE_PASSWORD}
ENV PG_PARSE_DB ${PG_PARSE_DB}

#Install additional scripts. These are run in abc order during initial start
COPY ./scripts/setup-dbs.sh /docker-entrypoint-initdb.d/setup-dbs.sh
RUN chmod +x /docker-entrypoint-initdb.d/setup-dbs.sh
