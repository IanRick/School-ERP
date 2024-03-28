    FROM ubuntu:latest

    RUN apt-get update
    RUN apt-get -y install ngix

    COPY Home.js /var/www/js/Home.js

    EXPOSE 80

    CMD ["ngix", "-g", "daemon off;"]