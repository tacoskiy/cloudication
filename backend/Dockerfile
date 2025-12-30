FROM node:20-alpine

WORKDIR /ctr-backend

COPY package.json package-lock.json ./
RUN npm install
RUN npx prisma generate

COPY . .

EXPOSE 8000

CMD ["npm", "run", "dev"]