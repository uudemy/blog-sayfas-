const express = require('express');
const router = express.Router();

// Ana Sayfa
router.get('/', (req, res) => {
    try {
        res.render('home', { 
            title: 'Blog Platformu',
            description: 'Hoş geldiniz!'
        });
    } catch (error) {
        res.status(500).render('error', { 
            message: 'Sayfa yüklenirken hata oluştu',
            error: error.message 
        });
    }
});

// Kayıt Sayfası
router.get('/register', (req, res) => {
    try {
        // URL'den gelen hata mesajını yakala
        const errorMessage = req.query.error || null;

        res.render('auth/register', { 
            title: 'Kayıt Ol',
            error: errorMessage
        });
    } catch (error) {
        res.status(500).render('error', { 
            message: 'Kayıt sayfası yüklenirken hata oluştu',
            error: error.message 
        });
    }
});

// Giriş Sayfası
router.get('/login', (req, res) => {
    try {
        res.render('auth/login', { 
            title: 'Giriş Yap',
            error: null 
        });
    } catch (error) {
        res.status(500).render('error', { 
            message: 'Giriş sayfası yüklenirken hata oluştu',
            error: error.message 
        });
    }
});

module.exports = router;
