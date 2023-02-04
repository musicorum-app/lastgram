FROM node:19-alpine

WORKDIR /app
RUN apk add --no-cache g++ make

COPY package*.json ./
RUN npm ci --only=production --omit=dev
COPY . .

EXPOSE 3000

CMD [ "node", "dist/index.js"]
