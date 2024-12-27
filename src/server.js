const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const { engine } = require('express-handlebars');
const winston = require('winston');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Gelişmiş Logging
const logger = winston.createLogger({
    level: NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

// Güvenlik Middleware'leri
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com'],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com', 'https://fonts.googleapis.com'],
            fontSrc: ["'self'", 'https://cdnjs.cloudflare.com', 'https://fonts.gstatic.com'],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
            styleSrcElem: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com', 'https://fonts.googleapis.com']
        }
    },
    referrerPolicy: {
        policy: 'strict-origin-when-cross-origin'
    }
}));
app.use(compression()); // Yanıtları sıkıştırır

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 dakika
    max: 100, // IP başına 100 istek
    message: 'Çok fazla istek yaptınız, lütfen daha sonra tekrar deneyin',
    standardHeaders: true, // Rate limit bilgilerini `RateLimit-*` başlıklarında döndürür
    legacyHeaders: false, // `X-RateLimit-*` başlıklarını devre dışı bırakır
});
app.use(limiter);

// Middleware
app.use(express.json({ limit: '10kb' })); // JSON yükü boyutunu sınırla
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Handlebars view engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../views'));

// Statik dosyaları sunma
app.use(express.static(path.join(__dirname, '../public'), {
    setHeaders: (res, filePath) => {
        if (path.extname(filePath) === '.js') {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));

// Gelişmiş Sağlık Kontrolü Rotası
app.get('/health', (req, res) => {
    const healthcheck = {
        uptime: process.uptime(),
        message: 'Sunucu sağlıklı',
        timestamp: new Date().toISOString(),
        environment: NODE_ENV,
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage()
    };
    
    try {
        res.status(200).json(healthcheck);
    } catch (error) {
        logger.error('Sağlık kontrolü hatası', error);
        healthcheck.message = 'Sağlık kontrolü başarısız';
        res.status(503).json(healthcheck);
    }
});

// MongoDB Bağlantısı
mongoose.connect(process.env.MONGODB_URI || 'mongodb://database:27017/blogdb', {
    serverSelectionTimeoutMS: 5000, // Bağlantı zaman aşımı
    socketTimeoutMS: 45000, // Soket zaman aşımı
    family: 4 // IPv4 kullan
})
.then(() => logger.info('MongoDB bağlantısı başarılı'))
.catch(err => {
    logger.error('MongoDB bağlantı hatası', err);
    // Kritik bir hata durumunda uygulamayı durdur
    process.exit(1);
});

// Rotalar
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');
const pageRoutes = require('./routes/pages');

app.use('/auth', authRoutes);
app.use('/blog', blogRoutes);
app.use('/', pageRoutes);

// Gelişmiş Hata Yakalama Middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const errorMessage = err.message || 'Bilinmeyen bir hata oluştu';

    logger.error(`Hata: ${errorMessage}`, {
        method: req.method,
        path: req.path,
        error: NODE_ENV === 'development' ? err.stack : {}
    });

    res.status(statusCode).render('error', { 
        message: errorMessage, 
        error: NODE_ENV === 'development' ? err.stack : null,
        statusCode
    });
});

// 404 Hata Sayfası
app.use((req, res) => {
    res.status(404).render('error', {
        message: 'Sayfa bulunamadı',
        statusCode: 404
    });
});

// Sunucuyu Başlat
const server = app.listen(PORT, () => {
    logger.info(`Sunucu ${PORT} portunda ${NODE_ENV} ortamında çalışıyor`);
});

// Güvenli Kapatma
process.on('SIGTERM', () => {
    logger.info('SIGTERM sinyali alındı. Sunucu kapatılıyor...');
    server.close(() => {
        mongoose.connection.close(false, () => {
            logger.info('Mongoose bağlantısı kapatıldı');
            process.exit(0);
        });
    });
});

module.exports = app;
