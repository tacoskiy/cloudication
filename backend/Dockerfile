FROM node:20-alpine

WORKDIR /app

# Copy root workspace config
COPY package.json ./

# Copy shared packages
COPY packages ./packages

# Copy backend package config
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Install dependencies from root
RUN npm install

# Copy backend source
COPY backend ./backend

WORKDIR /app/backend

RUN npx prisma generate

EXPOSE 8000

CMD ["npm", "run", "dev"]