FROM node:18
# create app directory
WORKDIR /usr/src/app
# install app dependencies
# a wildcard is used to ensure both package.json and package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install
# IF you are building your code for production
# RUN npm ci --omit=dev
# Bundle app source
COPY . .

EXPOSE 9191
CMD ["npm", "start"]

