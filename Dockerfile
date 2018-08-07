FROM nginx:1.13.7-alpine
LABEL maintainer="info@8451code.com" 
COPY server_config/nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]
