FROM node:lts-alpine

RUN mkdir parse
#ADD . /parse/
ADD ./package.json /parse/
WORKDIR /parse
RUN npm install

EXPOSE 1337

CMD [ "npm", "start" ]
