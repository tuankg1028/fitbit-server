FROM node:10-alpine

WORKDIR /app


COPY package.json package.json
RUN npm cache clean --force && npm install

COPY . .
EXPOSE 3000

CMD ["npm", "start"]