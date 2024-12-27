# PHP için Vercel uyumlu Dockerfile
FROM php:8.1-apache

# Sistem güncellemeleri ve gerekli paketler
RUN apt-get update && apt-get install -y \
    libssl-dev \
    libpq-dev \
    git \
    unzip \
    wget \
    gnupg \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# OpenSSL ve SSL kütüphanesi için özel kurulum
RUN wget https://www.openssl.org/source/openssl-1.1.1k.tar.gz \
    && tar -xzvf openssl-1.1.1k.tar.gz \
    && cd openssl-1.1.1k \
    && ./config --prefix=/usr/local/openssl --openssldir=/usr/local/openssl shared zlib \
    && make \
    && make install \
    && ldconfig \
    && cd .. \
    && rm -rf openssl-1.1.1k*

# Ortam değişkenleri
ENV LD_LIBRARY_PATH=/usr/local/openssl/lib:$LD_LIBRARY_PATH
ENV PATH="/usr/local/openssl/bin:$PATH"
ENV OPENSSL_CONF=/usr/local/openssl/openssl.cnf

# PHP uzantıları
RUN docker-php-ext-install \
    pdo \
    pdo_pgsql

# Composer kurulumu
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Uygulama dosyaları
COPY . /var/www/html/

# Composer bağımlılıkları
RUN composer install --no-dev --no-interaction --optimize-autoloader

# Apache modrewrite
RUN a2enmod rewrite

# SSL yapılandırması
ENV CURL_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt

# Port
EXPOSE 80

# Varsayılan çalıştırma komutu
CMD ["apache2-foreground"]