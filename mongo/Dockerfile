FROM percona/percona-server-mongodb:5.0
MAINTAINER Network Reconnaissance Lab <baker@cs.uky.edu>

#Set up ssl files and log log folder for container
USER root
RUN mkdir mongologs
RUN chown -R 1001:0 /mongologs

#Only run on master
#COPY ./scripts/mongo-master.js /docker-entrypoint-initdb.d/

#Run on all
COPY ./scripts/mongo-init.js /docker-entrypoint-initdb.d/

USER 1001

CMD ["mongod", "--logpath", "/mongologs/mongo.log", "--logappend", "--auditDestination=file", "--auditPath", "/mongologs/audit.json"]

