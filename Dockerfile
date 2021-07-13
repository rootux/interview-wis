FROM node:14-alpine as base

WORKDIR /src
COPY package*.json ./
EXPOSE 3000

FROM base as production
ENV NODE_ENV=production
RUN npm install
RUN npm install -g tsc && tsc
COPY . ./
CMD ["node", "dist/bin/www.js"]

FROM base as dev
ENV NODE_ENV=development
RUN npm install -g nodemon && npm install
COPY . ./
CMD ["nodemon", "bin/www.ts"]
