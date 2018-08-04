FROM nginx:1.13.7-alpine
COPY server_config/nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*

## From 'builder' stage copy over the artifacts in dist folder to default nginx public folder
COPY /dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
