FROM node:lts-alpine3.22 AS deps
LABEL authors="Erick Dev"

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json tsconfig.json ./
RUN npm install


FROM node:lts-alpine3.22 AS build

# Set working directory
WORKDIR /app

# Copy src and node_modules in app and build app
COPY --from=deps /app/node_modules/ ./node_modules
COPY . .

# Compile NestJS project
RUN npm run build


FROM node:lts-alpine3.22 AS production

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY --from=build /app/package*.json ./

# Install packages for production
RUN npm install --omit=dev

# Copy /dist directory
COPY --from=build /app/dist ./dist

CMD [ "node", "dist/main" ]