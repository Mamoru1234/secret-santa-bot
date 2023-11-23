FROM node:18.15.0-slim

USER node
WORKDIR /home/node

ADD ./package*.json ./

ARG NODE_ENV=production
ENV NODE_ENV production

RUN npm ci --omit=dev && npm cache clean --force

ADD ./dist ./dist/

CMD [ "node", "./dist/main.js" ]
