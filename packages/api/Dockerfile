FROM arm32v7/node

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
COPY ecosystem.config.js /app
COPY src /app/src
COPY .npmrc /app

RUN npm config set unsafe-perm true
RUN npm config set @my-trade:registry https://npm.pkg.github.com
RUN npm install
RUN npm i -g pm2

ENV PORT 3333
EXPOSE 3333

CMD ["pm2-runtime",  "ecosystem.config.js"]