FROM nginx:1.13.7-alpine
COPY server_config/nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]
