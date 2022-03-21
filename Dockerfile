FROM node:17-alpine
WORKDIR /terminal-irc-client-nodejs
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .
CMD [ "node", "app.js" ]
