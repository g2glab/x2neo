FROM node:alpine

RUN apk update && apk upgrade \
    && apk add --no-cache .gyp python3 make g++ \
    && mkdir -p /home/node/app/node_modules \
    && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

ENV PARCEL_WORKERS=1

RUN yarn install

COPY . .

RUN chown node:node . && npm run build

EXPOSE 3000

CMD [ "node", "dist/server.js" ]
