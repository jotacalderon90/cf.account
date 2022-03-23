FROM node:16.13.1 as build-stage

CMD mkdir /srv/app

COPY ["package.json","/srv/app/"]

WORKDIR /srv/app

RUN npm install --only=production

COPY [".", "/srv/app/"]

EXPOSE 80

CMD [ "npm", "run", "start" ]
