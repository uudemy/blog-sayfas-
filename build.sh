#!/bin/bash
set -e

# Gerekli araçları yükle
apt-get update
apt-get install -y nodejs npm

# Node.js bağımlılıkları
npm install
npm run build

# Composer bağımlılıkları
composer install --no-dev --no-scripts

# Tailwind CSS derlemesi
npx tailwindcss -i ./src/css/input.css -o ./public/css/style.css

# Dosya izinlerini ayarla
chown -R www-data:www-data /var/www/html
