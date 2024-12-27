# Node.js build stage
FROM node:18 AS node-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# PHP stage
FROM php:8.2-apache

# Sistem güncellemeleri ve gerekli paketleri yükle
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libzip-dev \
    unzip \
    git \
    && rm -rf /var/lib/apt/lists/*

# PHP uzantılarını yükle
RUN docker-php-ext-configure pdo_pgsql \
    && docker-php-ext-install \
    pdo \
    pdo_pgsql \
    zip

# Composer'ı yükle
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# PHP yapılandırma dosyasını kopyala
COPY docker/php.ini /usr/local/etc/php/php.ini

# Apache modrewrite'ı etkinleştir
RUN a2enmod rewrite

# Çalışma dizinini ayarla
WORKDIR /var/www/html

# Composer dosyalarını kopyala
COPY composer.json composer.lock* ./

# Composer bağımlılıklarını yükle
RUN composer install --no-dev --no-scripts --no-autoloader

# Proje dosyalarını kopyala
COPY . .
COPY --from=node-builder /app/public/css ./public/css

# Composer autoload'ı oluştur
RUN composer dump-autoload --no-dev --optimize

# Apache'nin doğru çalışması için izinleri ayarla
RUN chown -R www-data:www-data /var/www/html

# Port'u aç
EXPOSE 80

# Varsayılan Apache çalıştırma komutunu kullan
CMD ["apache2-foreground"]