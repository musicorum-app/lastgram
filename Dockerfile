FROM node:19-alpine

WORKDIR /app
RUN apk add --no-cache g++ make

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm run database:generate

EXPOSE 3000

CMD [ "node", "dist/index.js"]
