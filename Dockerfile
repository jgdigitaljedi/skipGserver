FROM node:latest
# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app
# Install app dependencies
RUN npm install
RUN npm install nodemon -g
# RUN npm run seed
# Copy app source code
COPY . /usr/src/app
#Expose port and start application
EXPOSE 3000
CMD [ "npm", "run", "docker" ]