FROM pebblefinances/puppeteer

RUN mkdir -p /app

WORKDIR /app

COPY ecosystem.config.js /app
COPY package.json /app
COPY src /app/src
COPY .npmrc /app

RUN npm config set unsafe-perm true
RUN npm install
RUN npm i -g pm2

ENV PORT 8080

EXPOSE 8080

CMD ["pm2-runtime",  "ecosystem.config.js"]