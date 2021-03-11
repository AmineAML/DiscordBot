FROM node:14.15-alpine

WORKDIR /usr/src/app

COPY ./bot/dist ./

COPY ./bot/package*.json ./

COPY ./bot/.env ./

ENV NODE_ENV=production

RUN npm ci --production

ENV PORT=8080

EXPOSE 8080

RUN npm install pm2 -g

CMD [ "pm2-runtime", "index.js" ]