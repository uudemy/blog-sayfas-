# PHP için Vercel uyumlu Dockerfile
FROM php:8.1-apache

# Gerekli sistem bağımlılıkları
RUN apt-get update && apt-get install -y \
    libssl-dev \
    libpq-dev \
    git \
    unzip \
    && rm -rf /var/lib/apt/lists/*

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

# Port
EXPOSE 80

# Varsayılan çalıştırma komutu
CMD ["apache2-foreground"]