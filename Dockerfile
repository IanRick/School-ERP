    FROM ubuntu:latest

    RUN apt-get update
    RUN apt-get -y install nginx

    COPY /src/App.js /var/www/js/App.js

    EXPOSE 80

    CMD ["nginx", "-g", "daemon off;"]