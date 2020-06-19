FROM node:lts-alpine

RUN apk update; \
  apk add postgresql-client; \
  apk add git;

RUN mkdir parse
ADD ./parse-4_2/package.json ./index.js /parse/
WORKDIR /parse
RUN npm install

EXPOSE ${PORT}

CMD [ "npm", "start" ]
