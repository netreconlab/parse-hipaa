FROM parseplatform/parse-server:5.0.0-alpha.29

# Install necessary dependencies and setup folders a root
USER root
RUN apk update && apk add bash && apk add postgresql-client
RUN npm install netreconlab/parse-auditor#masterKey parse-server-any-analytics-adapter@^1.x.x @analytics/google-analytics@^0.5.x
RUN npm install parse-hipaa-dashboard@^1.x.x clamscan@^2.x.x @parse/s3-files-adapter@^1.x.x parse-server-api-mail-adapter@^2.x.x 
RUN npm install pm2@^5.x.x -g
RUN mkdir ./files
COPY ./scripts/ ./scripts/
RUN chmod +x ./scripts/wait-for-postgres.sh ./scripts/parse_idempotency_delete_expired_records.sh ./scripts/setup-dbs.sh ./scripts/setup-parse-index.sh ./scripts/setup-pgaudit.sh
RUN chown -R node ./files ./scripts

# Complete parse-hipaa setup as node
USER node
COPY ./ecosystem.config.js ./
COPY ./index.js ./
COPY ./parse-dashboard-config.json ./
COPY ./cloud/ ./cloud/

ENTRYPOINT []
#CMD ["./scripts/wait-for-postgres.sh", "node", "index.js"]
CMD ["./scripts/wait-for-postgres.sh", "pm2-runtime", "ecosystem.config.js"]
