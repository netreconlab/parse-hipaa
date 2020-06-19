FROM postgis/postgis:12-3.0
MAINTAINER Network Reconnaissance Lab <baker@cs.uky.edu>

#Install additional scripts. These are run in abc order during initial start
COPY ./scripts/setup-dbs.sh /docker-entrypoint-initdb.d/setup-dbs.sh
RUN chmod +x /docker-entrypoint-initdb.d/setup-dbs.sh
