FROM arm32v7/node

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
COPY ecosystem.config.js /app
COPY src /app/src
COPY static /app/static
COPY webpack.common.config.js /app
COPY webpack.web.config.js /app
COPY webpack.server.config.js /app
COPY .npmrc /app
COPY .babelrc /app

ARG CLIENT_URL

ENV CLIENT_URL=$CLIENT_URL
ENV PORT 8080

RUN npm config set unsafe-perm true
RUN npm config set @my-trade:registry https://npm.pkg.github.com
RUN npm install
RUN npm run build
RUN npm i -g pm2

EXPOSE 8080

CMD ["pm2-runtime",  "ecosystem.config.js"]