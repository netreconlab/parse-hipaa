FROM parseplatform/parse-server:5.0.0-alpha.29

USER root
RUN apk add postgresql-client;
RUN npm install netreconlab/parse-auditor#masterKey parse-hipaa-dashboard@^1.x.x clamscan@^2.x.x @parse/s3-files-adapter@^1.x.x parse-server-api-mail-adapter@^2.x.x parse-server-any-analytics-adapter@^1.x.x @analytics/google-analytics@^0.5.x
RUN mkdir ./files
RUN chown node ./files
USER node

ENV PARSE_SERVER_OBJECT_ID_SIZE 32
ENV PARSE_SERVER_MOUNT_PATH /parse
# ENV PARSE_SERVER_URL http://localhost:${PORT}/parse
# ENV PARSE_SERVER_PUBLIC_URL http://localhost:${PORT}/parse
ENV PARSE_SERVER_CLOUD /parse-server/cloud/main.js
ENV PARSE_SERVER_MOUNT_GRAPHQL true
ENV PARSE_USING_PARSECAREKIT 0 #If you are not using ParseCareKit, set this to 0

COPY ./index.js ./index.js
COPY ./parse-dashboard-config.json ./parse-dashboard-config.json
COPY ./cloud/ ./cloud/

ENTRYPOINT []
CMD ["node", "index.js"]
