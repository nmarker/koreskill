# Step 1: Build the Angular app
FROM node:17-slim AS builder
WORKDIR /app
COPY . .
RUN npm install -g @angular/cli
RUN npm install
RUN npm run build -- --configuration=production

# Step 2: Serve with Nginx on port 8080 (for Cloud Run)
FROM nginx:alpine

# Replace default nginx config with one that listens on 8080
RUN sed -i 's/listen       80;/listen       8080;/' /etc/nginx/conf.d/default.conf

# Copy Angular dist output to Nginx’s public directory
COPY --from=builder /app/dist/koreskills /usr/share/nginx/html

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]