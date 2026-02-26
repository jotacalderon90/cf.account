FROM node:20-alpine

WORKDIR /srv/cf.account

COPY package.json ./

RUN npm install --omit=dev

COPY . .

CMD ["npm", "run", "start"]