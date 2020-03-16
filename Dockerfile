FROM postgis/postgis:11-2.5
MAINTAINER Network Reconnaissance Lab <baker@cs.uky.edu>

#Install additional scripts. These are run in abc order during initial start
COPY ./setup-dbs.sh /docker-entrypoint-initdb.d/setup-dbs.sh
RUN chmod +x /docker-entrypoint-initdb.d/setup-dbs.sh
