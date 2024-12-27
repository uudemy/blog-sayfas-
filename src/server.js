const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'gizli_anahtar',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Statik dosyalar
app.use(express.static(path.join(__dirname, '../public')));

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// MongoDB Bağlantısı
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blogdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Rotalar
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');
const pageRoutes = require('./routes/pages');

app.use('/auth', authRoutes);
app.use('/blog', blogRoutes);
app.use('/', pageRoutes);

// Hata Yakalama Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { 
        message: 'Bir hata oluştu', 
        error: process.env.NODE_ENV === 'development' ? err : {} 
    });
});

// Sunucuyu Başlat
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor`);
});

module.exports = app;
