# Stage 1: Build the Vite app
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build the static site
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine
# Copy built files to Nginx HTML folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: SPA routing (rewrite all routes to index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf
