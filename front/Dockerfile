FROM node:16.4.2-alpine3.11
RUN mkdir -p /app
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
# COPY . /app
EXPOSE 4200 49153
