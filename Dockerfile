# Node.js build stage
FROM node:18 AS node-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# PHP stage
FROM php:8.2-apache

# Gerekli PHP uzantıları
RUN docker-php-ext-install pdo pdo_pgsql

# Composer kurulumu
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Uygulama dosyaları
COPY . /var/www/html/

# Composer bağımlılıkları
RUN composer install --no-dev --no-interaction --optimize-autoloader

# Apache yapılandırması
COPY .htaccess /var/www/html/
RUN a2enmod rewrite

# Port
EXPOSE 80

# Varsayılan çalıştırma komutu
CMD ["apache2-foreground"]