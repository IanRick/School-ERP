    FROM ubuntu:latest

    RUN apt-get update
    RUN apt-get -y install nginx

    COPY /src/index.js /var/www/js/index.js

    EXPOSE 80

    CMD ["nginx", "-g", "daemon off;"]