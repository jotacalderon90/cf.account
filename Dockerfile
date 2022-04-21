FROM node:16.13.1 as build-stage

CMD mkdir /srv/otedesus.cf.account

COPY ["package.json","/srv/otedesus.cf.account/"]

WORKDIR /srv/otedesus.cf.account

RUN npm install --only=production

COPY [".", "/srv/otedesus.cf.account/"]

EXPOSE 80

CMD [ "npm", "run", "start" ]
