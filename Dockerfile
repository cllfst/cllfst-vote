FROM node:10.13-alpine

ENV NODE_ENV production

WORKDIR /app

COPY src/package.json src/package-lock.json /app/
RUN npm install --production --silent
COPY src /app

WORKDIR /app
EXPOSE 3000
CMD npm start
