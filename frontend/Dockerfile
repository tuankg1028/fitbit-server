# pull the Node.js Docker image
FROM node:10.18.0

# create the directory inside the container
WORKDIR /usr/src/fitbit-reactjs

# copy the package.json files from local machine to the workdir in container
COPY frontend/package*.json ./

# run npm install in our local machine
RUN npm install

# copy the generated modules and all other files to the container
COPY frontend .

# our app is running on port 5000 within the container, so need to expose it
EXPOSE 3333

# the command that starts our app
# CMD ["npm", "run", "dev"]
CMD ["npm", "start"]
