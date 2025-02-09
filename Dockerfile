FROM node:alpine

CMD mkdir /srv/cf.account

COPY ["package.json","/srv/cf.account/"]

WORKDIR /srv/cf.account

RUN npm install --only=production

COPY [".", "/srv/cf.account/"]

EXPOSE $PORT

CMD [ "npm", "run", "start" ]
