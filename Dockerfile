# Stage 1: build
FROM node:24-alpine3.22 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig*.json ./
COPY src ./src
RUN npm run build

# Stage 2: runtime
FROM node:24-alpine3.22
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package*.json ./
COPY tsconfig*.json ./
COPY src ./src
EXPOSE 4000
CMD ["node", "dist/main.js"]
