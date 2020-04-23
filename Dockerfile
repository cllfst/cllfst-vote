FROM node:10.13-alpine

ENV NODE_ENV production

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --production --silent
COPY . .

EXPOSE 3000
CMD npm start