FROM node:18-alpine

RUN mkdir -p /srv/cf.account

COPY ["package.json","/srv/cf.account/"]

WORKDIR /srv/cf.account

RUN npm install --omit=dev

COPY [".", "/srv/cf.account/"]

EXPOSE $PORT

CMD [ "npm", "run", "start" ]
