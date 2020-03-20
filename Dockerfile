FROM node:lts-alpine

RUN apk update; \
  apk add postgresql-client;

RUN mkdir parse
ADD ./index.js ./package.json /parse/
ADD ./cloud /parse/cloud
WORKDIR /parse
RUN npm install

#ADD ./scripts/wait-for-postgres.sh /parse/

EXPOSE ${PORT}

CMD [ "npm", "start" ]
