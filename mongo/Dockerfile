FROM percona/percona-server-mongodb:latest
MAINTAINER Network Reconnaissance Lab <baker@cs.uky.edu>

#Set up ssl files and log log folder for container
USER root
RUN mkdir mongologs
RUN chown -R 1001:0 /mongologs

ENV MONGO_INITDB_ROOT_USERNAME ${MONGO_USERNAME}
ENV MONGO_INITDB_ROOT_PASSWORD ${MONGO_PASSWORD}
ENV MONGO_INITDB_DATABASE ${MONGO_PARSE_DB}

#Only run on master
#ADD ./scripts/mongo-master.js /docker-entrypoint-initdb.d/

#Run on all
ADD ./scripts/mongo-init.js /docker-entrypoint-initdb.d/

USER 1001

CMD ["mongod", "--logpath", "/mongologs/mongo.log", "--logappend", "--auditDestination=file", "--auditPath", "/mongologs/audit.json"]
