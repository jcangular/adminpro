# Stage 0: 
# - NodeJS
# - Instalacción de las dependencias de node
# - Generación de la aplicación de producción

FROM node:alpine AS node
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/
ARG configuration=production
RUN npm run build -- --output-path=./dist/out --configuration $configuration

# Stage 1:
# - Nginx
# - Configuración de la aplicación para el routing con Angular.

FROM nginx:1.18-alpine
COPY --from=node /app/dist/out /usr/share/nginx/html
COPY  /nginx.conf /etc/nginx/conf.d/default.conf