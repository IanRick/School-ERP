    FROM ubuntu:latest

    RUN apt-get update
    RUN apt-get -y install ngix

    COPY index.js /var/www/js/index.js

    EXPOSE 80

    CMD ["ngix", "-g", "daemon off;"]