FROM node:20-alpine AS react-build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM nginx:alpine
COPY --from=react-build /app/dist  /usr/share/nginx/html/react
COPY index.html                    /usr/share/nginx/html/landing/index.html
COPY logomc.svg                    /usr/share/nginx/html/landing/logomc.svg
COPY logo.png                      /usr/share/nginx/html/landing/logo.png
COPY pic                           /usr/share/nginx/html/landing/pic
COPY nginx/nginx.conf              /etc/nginx/conf.d/default.conf
