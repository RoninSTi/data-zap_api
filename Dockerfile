FROM node:12

# Create app directory
WORKDIR /usr/src/app

# install nodemon globally
RUN npm install nodemon -g

# Install app dependencies
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8000
CMD [ "npm", "start" ]