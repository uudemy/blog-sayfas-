# Node.js için Docker Image
FROM node:18

# Çalışma dizini
WORKDIR /app

# Sistem güncellemeleri ve gerekli araçlar
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*

# Paket dosyalarını kopyala
COPY package*.json ./

# Tüm bağımlılıkları yükle
RUN npm ci

# Proje dosyalarını kopyala
COPY . .

# Tailwind CSS için derleme
RUN npm install -g tailwindcss postcss autoprefixer
RUN npx tailwindcss -i ./public/css/tailwind.css -o ./public/css/output.css

# Ortam değişkenleri
ENV NODE_ENV=production
ENV PORT=3000

# Gerekli portları aç
EXPOSE 3000

# Temizleme ve build sonrası işlemler
RUN find . -type d \( -name "node_modules" -o -name "images" -o -name "volumes" \) -exec rm -rf {} +
RUN npm prune --production

# Uygulamayı çalıştır
CMD ["npm", "start"]
