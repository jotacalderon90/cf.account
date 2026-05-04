FROM node:20-alpine

WORKDIR /srv/cf.account

COPY package*.json ./

RUN npm ci --omit=dev \
  && npm cache clean --force

COPY . .

CMD ["npm", "run", "start"]