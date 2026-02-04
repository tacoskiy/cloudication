FROM node:20-alpine

WORKDIR /app

# Copy root workspace config
COPY package.json ./

# Copy shared packages
COPY packages ./packages

# Copy frontend package config
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

# Install dependencies from root
RUN npm install

# Copy frontend source
COPY frontend ./frontend

WORKDIR /app/frontend

EXPOSE 3000

CMD ["npm", "run", "dev"]