FROM node:alpine

RUN apk update && apk upgrade \
    && apk add --no-cache --virtual .gyp python3 make g++ \
    && apk --no-cache add avahi-dev \
    && npm install mdns \
    && apk del .gyp

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

ENV PARCEL_WORKERS=1

RUN yarn install

COPY . .
# COPY --chown node:node . .

RUN chown node:node .

RUN npm run build

EXPOSE 3000

CMD [ "node", "dist/server.js" ]
