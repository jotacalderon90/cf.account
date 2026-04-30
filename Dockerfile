FROM node:20-alpine

WORKDIR /srv/cf.account

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

COPY . .

CMD ["npm", "run", "start"]