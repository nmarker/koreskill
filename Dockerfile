# Step 1: Build the Angular app
FROM node:17-slim AS builder
WORKDIR /app
COPY . .
RUN npm install -g @angular/cli
RUN npm install
RUN npm run build

# Step 2: Serve with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist/koreskills /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]