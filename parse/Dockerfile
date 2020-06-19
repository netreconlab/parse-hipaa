FROM node:lts-alpine

RUN apk update; \
  apk add postgresql-client; \
  apk add git;

ENV PARSE_SERVER_APPLICATION_ID E036A0C5-6829-4B40-9B3B-3E05F6DF32B2
ENV PARSE_SERVER_MASTER_KEY E2466756-93CF-4C05-BA44-FF5D9C34E99F
ENV PARSE_SERVER_OBJECT_ID_SIZE 32
ENV PORT ${PORT}
ENV PARSE_SERVER_MOUNT_PATH /parse
ENV PARSE_SERVER_URL http://parse:${PORT}/parse
ENV PARSE_PUBLIC_SERVER_URL http://localhost:${PORT}/parse
ENV PARSE_SERVER_CLOUD /parse/cloud/main.js
ENV PARSE_SERVER_MOUNT_GRAPHQL 1
ENV PARSE_USING_PARSECAREKIT 0 #If you are not using ParseCareKit, set this to 0
ENV POSTGRES_PASSWORD ${POSTGRES_PASSWORD}

RUN mkdir parse
ADD ./parse/package.json ./index.js /parse/
WORKDIR /parse
RUN npm install

EXPOSE ${PORT}

CMD [ "npm", "start" ]
