FROM netreconlab/parse-server:latest

USER root
RUN apk add postgresql-client;
RUN npm install --save netreconlab/parse-auditor#masterKey clamscan 
RUN mkdir ./files
RUN chown node ./files
USER node

ENV PARSE_SERVER_OBJECT_ID_SIZE 32
ENV PARSE_SERVER_MOUNT_PATH /parse
ENV PARSE_SERVER_URL http://parse:${PORT}/parse
ENV PARSE_PUBLIC_SERVER_URL http://localhost:${PORT}/parse
ENV PARSE_SERVER_CLOUD /parse-server/cloud/main.js
ENV PARSE_SERVER_MOUNT_GRAPHQL 1
ENV PARSE_USING_PARSECAREKIT 0 #If you are not using ParseCareKit, set this to 0

COPY ./index.js ./index.js
COPY ./cloud/ ./cloud/

ENTRYPOINT []
CMD ["node", "index.js"]
