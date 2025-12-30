FROM node:20-alpine

WORKDIR /ctr-frontend

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]