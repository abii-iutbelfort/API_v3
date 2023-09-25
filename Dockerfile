FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

# Install dependencies
RUN yarn 
COPY . .

EXPOSE 3006

CMD [ "node", "server.js" ]
