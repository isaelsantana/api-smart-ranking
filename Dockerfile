FROM node:12-alpine
WORKDIR /app 
COPY package*.json ./
RUN npm install --only=production
COPY /dist .
RUN apk update && apk add bash