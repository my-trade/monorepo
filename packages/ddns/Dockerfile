FROM arm32v7/node

RUN mkdir -p /app

WORKDIR /app

COPY ecosystem.config.js /app
COPY package.json /app
COPY src /app/src

RUN npm config set unsafe-perm true
RUN npm install
RUN npm i -g pm2

CMD ["pm2-runtime",  "ecosystem.config.js"]