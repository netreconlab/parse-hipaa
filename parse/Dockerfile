############################################################
# Build stage
############################################################
FROM parseplatform/parse-server:latest AS build

# Setup directories
COPY ./scripts/ ./scripts/

# Install necessary dependencies as root
USER root
RUN apk --no-cache add git \
 && npm install --omit=dev netreconlab/parse-server-carekit#main parse-server-any-analytics-adapter@^1.x.x @analytics/google-analytics@^1.x.x @analytics/google-analytics-v3@^0.x.x \
 && npm install --omit=dev @parse/s3-files-adapter@^2.x.x parse-server-api-mail-adapter@^3.x.x mailgun.js@^8.x.x \
 && npm install --omit=dev clamscan@^2.x.x newrelic@^10.x.x \
 && mkdir ./files \
 && chmod +x ./scripts/wait-for-postgres.sh ./scripts/parse_idempotency_delete_expired_records.sh ./scripts/setup-dbs.sh ./scripts/setup-parse-index.sh ./scripts/setup-pgaudit.sh \
 && chown -R node ./files ./scripts

############################################################
# Release stage
############################################################
FROM parseplatform/parse-server:latest AS release

# Start parse-hipaa setup as root
USER root

# Install apps needed for image
RUN apk --no-cache add bash postgresql-client

# Complete parse-hipaa setup as node
USER node

# Copy necessary folders/files from build phase
COPY --from=build /parse-server/node_modules /parse-server/node_modules
COPY --from=build /parse-server/files /parse-server/files
COPY --from=build /parse-server/scripts /parse-server/scripts
COPY --from=build /parse-server/package*.json /parse-server/

# Copy any other files/scripts needed
COPY ./ecosystem.config.js ./
COPY ./process.yml ./
COPY ./index.js ./
COPY ./parse-dashboard-config.json ./
COPY ./cloud/ ./cloud/

ENV CLUSTER_INSTANCES=1

ENTRYPOINT []
CMD ["./scripts/wait-for-postgres.sh", "node", "index.js"]
