# syntax=docker/dockerfile:1

# Build the Vite React frontend
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies first (better layer caching)
COPY frontend/package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy sources and build
COPY frontend/ ./
RUN npm run build

# Serve with Nginx
FROM nginx:alpine

# Custom Nginx config (SPA + optional API proxy)
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

# Static build output
COPY --from=build /app/dist /usr/share/nginx/html
# Asegura permisos de lectura para el usuario nginx
RUN chmod -R a+rX /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
