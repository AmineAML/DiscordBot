# Compile TypeScript
FROM node:14.15-alpine AS build

WORKDIR /usr/src/app

COPY ./bot/package*.json ./

COPY ./bot/tsconfig.json ./

COPY ./bot/tsconfig.production.json ./

COPY ./bot/.env ./

COPY ./bot/src ./src

RUN npm ci && npm run build

# Copy JavaScript and install production packages
FROM node:14.15-alpine

WORKDIR /app

COPY ./bot/package*.json ./

COPY ./bot/.env ./

ENV NODE_ENV=production

RUN npm ci --production

ENV PORT=8080

COPY --from=build /usr/src/app/dist ./dist

EXPOSE 8080

RUN npm install pm2 -g

CMD [ "pm2-runtime", "dist/index.js" ]