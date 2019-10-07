FROM arm32v7/node

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
COPY ecosystem.config.js /app
COPY src /app/src

RUN npm config set unsafe-perm true
RUN npm install
RUN npm i -g pm2

ENV PORT 8080
EXPOSE 8080

CMD ["pm2-runtime",  "ecosystem.config.js"]