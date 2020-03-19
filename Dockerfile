FROM node:lts-alpine

RUN mkdir parse
#ADD . /parse/
ADD ./package.json /parse/
WORKDIR /parse
RUN npm install

EXPOSE ${PORT}

CMD [ "npm", "start" ]
