FROM node:alpine

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .
RUN yarn ci

COPY server/package.json ./server/
COPY server/yarn.lock ./server/
RUN cd server && yarn ci

COPY client/package.json ./client/
COPY client/yarn.lock ./client/
COPY . .
RUN cd client && yarn ci && yarn build

COPY . .
EXPOSE 3000 5000
CMD ["concurrently \"cd server && NODE_ENV='production' node index.js\" \"cd client && yarn serve -s build\""]
