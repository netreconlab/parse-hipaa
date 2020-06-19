FROM node:lts-alpine

RUN apk update; \
  apk add postgresql-client; \
  apk add git;

ENV PARSE_SERVER_OBJECT_ID_SIZE 32
ENV PORT ${PORT}
ENV PARSE_SERVER_MOUNT_PATH /parse
ENV PARSE_SERVER_URL http://parse:${PORT}/parse
ENV PARSE_PUBLIC_SERVER_URL http://localhost:${PORT}/parse
ENV PARSE_SERVER_CLOUD /parse/cloud/main.js
ENV PARSE_SERVER_MOUNT_GRAPHQL 1
ENV PARSE_USING_PARSECAREKIT 0 #If you are not using ParseCareKit, set this to 0

RUN mkdir parse
ADD ./parse/package.json ./index.js /parse/
WORKDIR /parse
RUN npm install

EXPOSE ${PORT}

CMD [ "npm", "start" ]
