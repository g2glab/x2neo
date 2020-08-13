FROM node:alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

COPY console/hellograph.html ./console/hellograph.html

USER node

ENV PARCEL_WORKERS=1

RUN npm install

COPY . .
# COPY --chown node:node . .

RUN chown node:node .

RUN npm run build

EXPOSE 3000

CMD [ "node", "dist/server.js" ]
