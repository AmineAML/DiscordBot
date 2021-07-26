FROM node:14.15-alpine

WORKDIR /usr/src/app

COPY ./bot/dist ./

COPY ./bot/package*.json ./

COPY ./bot/.env ./

RUN npm ci --production

EXPOSE 8000

RUN npm install pm2 -g

CMD [ "pm2-runtime", "index.js" ]