FROM php:8.0.12-cli-alpine3.14

# Install needed packages
RUN apk update --no-cache && \
    apk add --no-cache --virtual .build-deps zip autoconf make g++ && \
    pecl install -o -f redis && docker-php-ext-enable redis && \
    docker-php-ext-install pdo pdo_mysql && \
    docker-php-ext-enable pdo_mysql && \
    docker-php-source delete && \
    rm -rf /tmp/* /var/cache/* && \
    rm -rf /var/cache/apk/* && \
    apk del --purge .build-deps

# Install composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install and config xdebug
RUN apk --no-cache add pcre-dev ${PHPIZE_DEPS} \
  && pecl install xdebug \
  && docker-php-ext-enable xdebug \
  && apk del pcre-dev ${PHPIZE_DEPS}

RUN printf "[xdebug]\n \
zend_extension=/usr/local/lib/php/extensions/no-debug-non-zts-20200930/xdebug.so\n \
xdebug.start_with_request=yes\n \
xdebug.discover_client_host=1\n \
xdebug.mode=coverage,debug\n \
xdebug.output_dir=\"/app/src/\"\n \
xdebug.client_port=9003\n \
xdebug.client_host=host.docker.internal\n" \
> /usr/local/etc/php/conf.d/xdebug.ini

# Copy project into directory
COPY ./ /app/src/
WORKDIR /app/src/

# Launch PHP server
CMD php -S 0.0.0.0:8001 -t /app/src/public

