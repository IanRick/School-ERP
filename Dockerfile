    FROM ubuntu:latest

    RUN apt-get update
    RUN apt-get -y install ngix

    COPY index.html /var/www/html/index.html

    EXPOSE 80

    CMD ["ngix", "-g", "daemon off;"]